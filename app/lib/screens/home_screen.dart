import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/secrets_provider.dart';
import '../widgets/secret_card.dart';
import '../widgets/add_menu_sheet.dart';

/// 主页 - TOTP 验证码列表
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  final _searchController = TextEditingController();
  Timer? _clockTimer;   // 每秒刷新 UI 时钟用
  Timer? _syncTimer;    // 每 30 秒从服务器同步数据

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    // 每秒刷新触发卡片倒计时重建
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });

    // 每 30 秒自动从服务器拉取最新数据（同步网站端变更）
    _syncTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) context.read<SecretsProvider>().refresh();
    });

    // 页面首次显示时立即刷新一次
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<SecretsProvider>().refresh();
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // App 从后台恢复时立即同步
      context.read<SecretsProvider>().refresh();
    }
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    _syncTimer?.cancel();
    _searchController.dispose();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  void _showAddMenu() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => const AddMenuSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colors.surface,
      body: CustomScrollView(
        slivers: [
          // 顶部 AppBar（带搜索）
          _buildAppBar(colors),

          // 内容区
          Consumer<SecretsProvider>(
            builder: (context, secrets, _) {
              if (secrets.isLoading && secrets.count == 0) {
                return const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                );
              }

              if (secrets.loadState == LoadState.error && secrets.count == 0) {
                return SliverFillRemaining(
                  child: _buildError(secrets.error!, colors),
                );
              }

              if (secrets.secrets.isEmpty) {
                return SliverFillRemaining(
                  child: _buildEmpty(colors),
                );
              }

              return SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                sliver: SliverList.builder(
                  itemCount: secrets.secrets.length,
                  itemBuilder: (context, i) {
                    final entry = secrets.secrets[i];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SecretCard(entry: entry),
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),

      // FAB - 添加按钮
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddMenu,
        icon: const Icon(Icons.add_rounded),
        label: const Text('添加账户'),
      ),
    );
  }

  SliverAppBar _buildAppBar(ColorScheme colors) {
    return SliverAppBar(
      floating: true,
      snap: true,
      title: const Text('2FA 验证器'),
      actions: [
        // 刷新按钮
        Consumer<SecretsProvider>(
          builder: (context, secrets, _) => IconButton(
            onPressed: secrets.isLoading ? null : secrets.refresh,
            icon: secrets.isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.sync_rounded),
            tooltip: '同步',
          ),
        ),
        // 排序
        Consumer<SecretsProvider>(
          builder: (context, secrets, _) => PopupMenuButton<String>(
            initialValue: secrets.sortBy,
            onSelected: secrets.setSort,
            icon: const Icon(Icons.sort_rounded),
            tooltip: '排序',
            itemBuilder: (_) => const [
              PopupMenuItem(value: 'name', child: Text('按名称排序')),
              PopupMenuItem(value: 'createdAt', child: Text('按添加时间')),
            ],
          ),
        ),
        // 备份
        IconButton(
          onPressed: () => context.push('/home/backup'),
          icon: const Icon(Icons.backup_outlined),
          tooltip: '备份管理',
        ),
        // 设置
        IconButton(
          onPressed: () => context.push('/settings'),
          icon: const Icon(Icons.settings_outlined),
          tooltip: '设置',
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(64),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
          child: Consumer<SecretsProvider>(
            builder: (context, secrets, _) => SearchBar(
              controller: _searchController,
              hintText: '搜索账户或服务名称…',
              leading: const Icon(Icons.search_rounded),
              trailing: [
                if (_searchController.text.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () {
                      _searchController.clear();
                      secrets.search('');
                    },
                  ),
              ],
              onChanged: secrets.search,
              elevation: const WidgetStatePropertyAll(0),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmpty(ColorScheme colors) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.lock_outline_rounded,
            size: 64,
            color: colors.outlineVariant,
          ),
          const SizedBox(height: 16),
          Text(
            '还没有账户',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: colors.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '点击下方按钮添加第一个两步验证账户',
            style: TextStyle(color: colors.onSurfaceVariant),
          ),
        ],
      ),
    );
  }

  Widget _buildError(String error, ColorScheme colors) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off_rounded, size: 64, color: colors.error),
            const SizedBox(height: 16),
            Text(
              '加载失败',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: colors.error,
              ),
            ),
            const SizedBox(height: 8),
            Text(error, textAlign: TextAlign.center),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => context.read<SecretsProvider>().refresh(),
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('重试'),
            ),
          ],
        ),
      ),
    );
  }
}
