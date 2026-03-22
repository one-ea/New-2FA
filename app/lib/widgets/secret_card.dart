import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../models/secret_entry.dart';
import '../providers/secrets_provider.dart';
import '../services/otp_engine.dart';
import 'edit_secret_sheet.dart';

/// TOTP 验证码卡片
/// 支持：点击复制、长按选项、进度条倒计时、服务图标
class SecretCard extends StatelessWidget {
  final SecretEntry entry;

  const SecretCard({super.key, required this.entry});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    // 计算当前和下一个 OTP
    final currentOtp = OtpEngine.generateTotp(
      secret: entry.secret,
      digits: entry.digits,
      period: entry.period,
      algorithm: entry.algorithm,
    );
    final nextOtp = OtpEngine.generateNextTotp(
      secret: entry.secret,
      digits: entry.digits,
      period: entry.period,
      algorithm: entry.algorithm,
    );
    final remaining = OtpEngine.remainingSeconds(period: entry.period);
    final progress = OtpEngine.remainingProgress(period: entry.period);
    final isUrgent = remaining <= 5; // 剩余 5 秒变红色警告

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _copyOtp(context, currentOtp),
        onLongPress: () => _showOptions(context),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 服务名行
              Row(
                children: [
                  // 服务图标
                  _ServiceIcon(entry: entry),
                  const SizedBox(width: 12),
                  // 服务名 + 账户名
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          entry.name,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (entry.account.isNotEmpty)
                          Text(
                            entry.account,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: colors.onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                      ],
                    ),
                  ),
                  // 更多操作按钮
                  IconButton(
                    onPressed: () => _showOptions(context),
                    icon: const Icon(Icons.more_vert_rounded),
                    iconSize: 20,
                    visualDensity: VisualDensity.compact,
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // OTP 显示行
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // 当前 OTP（大字号）
                  Expanded(
                    child: Text(
                      _formatOtp(currentOtp),
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w300,
                        letterSpacing: 6,
                        fontFeatures: const [FontFeature.tabularFigures()],
                        color: isUrgent ? colors.error : colors.onSurface,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                  // 下一个 OTP（小字号）
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '下一个',
                        style: TextStyle(
                          fontSize: 10,
                          color: colors.onSurfaceVariant,
                        ),
                      ),
                      Text(
                        _formatOtp(nextOtp),
                        style: TextStyle(
                          fontSize: 14,
                          color: colors.onSurfaceVariant,
                          fontFamily: 'monospace',
                          letterSpacing: 2,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 10),

              // 进度条 + 剩余时间
              Row(
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 4,
                        color: isUrgent ? colors.error : colors.primary,
                        backgroundColor: colors.surfaceContainerHighest,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${remaining}s',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isUrgent ? colors.error : colors.onSurfaceVariant,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// 将 OTP 中间加空格（如 123456 → 123 456）
  String _formatOtp(String otp) {
    if (otp.length == 6) return '${otp.substring(0, 3)} ${otp.substring(3)}';
    if (otp.length == 8) return '${otp.substring(0, 4)} ${otp.substring(4)}';
    return otp;
  }

  Future<void> _copyOtp(BuildContext context, String otp) async {
    await Clipboard.setData(ClipboardData(text: otp));
    HapticFeedback.lightImpact();
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('已复制 ${entry.name} 的验证码'),
          duration: const Duration(seconds: 2),
          action: SnackBarAction(label: '关闭', onPressed: () {}),
        ),
      );
    }
  }

  void _showOptions(BuildContext context) {
    HapticFeedback.selectionClick();
    showModalBottomSheet(
      context: context,
      builder: (ctx) => _OptionsSheet(entry: entry),
    );
  }
}

/// 服务图标（网络图标 + 首字母 Fallback）
class _ServiceIcon extends StatelessWidget {
  final SecretEntry entry;

  const _ServiceIcon({required this.entry});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    // 构造 favicon URL，借助后端代理避免 CORS
    // 也可以直接用 Google Favicon 服务
    final faviconUrl =
        'https://www.google.com/s2/favicons?sz=64&domain=${entry.iconDomain}';

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: colors.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(10),
      ),
      clipBehavior: Clip.antiAlias,
      child: Image.network(
        faviconUrl,
        width: 40,
        height: 40,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _FallbackIcon(name: entry.name),
        loadingBuilder: (_, child, progress) {
          if (progress == null) return child;
          return _FallbackIcon(name: entry.name);
        },
      ),
    );
  }
}

class _FallbackIcon extends StatelessWidget {
  final String name;

  const _FallbackIcon({required this.name});

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final initial = name.isNotEmpty ? name[0].toUpperCase() : '?';
    return Container(
      alignment: Alignment.center,
      color: colors.primaryContainer,
      child: Text(
        initial,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: colors.onPrimaryContainer,
        ),
      ),
    );
  }
}

/// 卡片操作选项（底部弹出）
class _OptionsSheet extends StatelessWidget {
  final SecretEntry entry;

  const _OptionsSheet({required this.entry});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: Row(
            children: [
              _ServiceIcon(entry: entry),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(entry.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                        )),
                    if (entry.account.isNotEmpty)
                      Text(entry.account,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                            fontSize: 13,
                          )),
                  ],
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 24),
        ListTile(
          leading: const Icon(Icons.copy_rounded),
          title: const Text('复制当前验证码'),
          onTap: () {
            Navigator.pop(context);
            final otp = OtpEngine.generateTotp(
              secret: entry.secret,
              digits: entry.digits,
              period: entry.period,
              algorithm: entry.algorithm,
            );
            Clipboard.setData(ClipboardData(text: otp));
            HapticFeedback.lightImpact();
          },
        ),
        ListTile(
          leading: const Icon(Icons.edit_outlined),
          title: const Text('编辑'),
          onTap: () {
            Navigator.pop(context);
            showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              builder: (_) => EditSecretSheet(entry: entry),
            );
          },
        ),
        ListTile(
          leading: Icon(Icons.delete_outline_rounded,
              color: Theme.of(context).colorScheme.error),
          title: Text('删除',
              style:
                  TextStyle(color: Theme.of(context).colorScheme.error)),
          onTap: () {
            Navigator.pop(context);
            _confirmDelete(context);
          },
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        icon: Icon(Icons.warning_amber_rounded,
            color: Theme.of(ctx).colorScheme.error),
        title: const Text('确认删除'),
        content: Text('确定要删除 "${entry.name}" 的两步验证账户吗？\n\n此操作无法撤销。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(ctx).colorScheme.error,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<SecretsProvider>().deleteSecret(entry.id);
            },
            child: const Text('删除'),
          ),
        ],
      ),
    );
  }
}
