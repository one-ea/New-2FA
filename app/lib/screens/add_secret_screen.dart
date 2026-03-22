import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/secret_entry.dart';
import '../providers/secrets_provider.dart';

/// 手动添加 / 编辑 2FA 账户表单页
class AddSecretScreen extends StatefulWidget {
  final String? otpauthUri; // 从 QR 扫描传入的 URI

  const AddSecretScreen({super.key, this.otpauthUri});

  @override
  State<AddSecretScreen> createState() => _AddSecretScreenState();
}

class _AddSecretScreenState extends State<AddSecretScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _accountController = TextEditingController();
  final _secretController = TextEditingController();
  final _issuerController = TextEditingController();

  String _type = 'totp';
  int _digits = 6;
  int _period = 30;
  String _algorithm = 'SHA1';
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    // 如果从 QR 传入 URI，预填充字段
    if (widget.otpauthUri != null) {
      try {
        final entry = SecretEntry.fromOtpAuthUri(widget.otpauthUri!);
        _nameController.text = entry.name;
        _accountController.text = entry.account;
        _secretController.text = entry.secret;
        _issuerController.text = entry.issuer ?? '';
        _type = entry.type;
        _digits = entry.digits;
        _period = entry.period;
        _algorithm = entry.algorithm;
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _accountController.dispose();
    _secretController.dispose();
    _issuerController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _saving = true);

    final entry = SecretEntry(
      id: '',
      name: _nameController.text.trim(),
      account: _accountController.text.trim(),
      secret: _secretController.text.trim().toUpperCase().replaceAll(' ', ''),
      type: _type,
      digits: _digits,
      period: _period,
      algorithm: _algorithm,
      issuer: _issuerController.text.trim().isEmpty
          ? null
          : _issuerController.text.trim(),
    );

    final success = await context.read<SecretsProvider>().addSecret(entry);

    if (mounted) {
      setState(() => _saving = false);
      if (success) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('已添加 ${entry.name}')),
        );
      } else {
        final err = context.read<SecretsProvider>().error ?? '保存失败';
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(err)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('添加账户'),
        actions: [
          TextButton(
            onPressed: _saving ? null : _save,
            child: _saving
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('保存'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 基本信息
            const _SectionTitle('基本信息'),
            const SizedBox(height: 12),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: '服务名称',
                hintText: '例：Google',
                prefixIcon: Icon(Icons.business_rounded),
              ),
              textCapitalization: TextCapitalization.words,
              validator: (v) =>
                  v == null || v.trim().isEmpty ? '请输入服务名称' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _accountController,
              decoration: const InputDecoration(
                labelText: '账户名',
                hintText: '例：user@example.com',
                prefixIcon: Icon(Icons.person_outline_rounded),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _secretController,
              decoration: const InputDecoration(
                labelText: '密钥（Base32）',
                hintText: '例：JBSWY3DPEHPK3PXP',
                prefixIcon: Icon(Icons.key_rounded),
              ),
              autocorrect: false,
              textCapitalization: TextCapitalization.characters,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return '请输入密钥';
                final cleaned = v.trim().toUpperCase().replaceAll(' ', '');
                if (!RegExp(r'^[A-Z2-7]+=*$').hasMatch(cleaned)) {
                  return '密钥格式无效（只能包含 A-Z 和 2-7）';
                }
                return null;
              },
            ),

            const SizedBox(height: 24),

            // 高级配置（可折叠）
            _AdvancedSection(
              type: _type,
              digits: _digits,
              period: _period,
              algorithm: _algorithm,
              onTypeChanged: (v) => setState(() => _type = v),
              onDigitsChanged: (v) => setState(() => _digits = v),
              onPeriodChanged: (v) => setState(() => _period = v),
              onAlgorithmChanged: (v) => setState(() => _algorithm = v),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: Theme.of(context).colorScheme.primary,
        letterSpacing: 0.5,
      ),
    );
  }
}

class _AdvancedSection extends StatefulWidget {
  final String type;
  final int digits;
  final int period;
  final String algorithm;
  final ValueChanged<String> onTypeChanged;
  final ValueChanged<int> onDigitsChanged;
  final ValueChanged<int> onPeriodChanged;
  final ValueChanged<String> onAlgorithmChanged;

  const _AdvancedSection({
    required this.type,
    required this.digits,
    required this.period,
    required this.algorithm,
    required this.onTypeChanged,
    required this.onDigitsChanged,
    required this.onPeriodChanged,
    required this.onAlgorithmChanged,
  });

  @override
  State<_AdvancedSection> createState() => _AdvancedSectionState();
}

class _AdvancedSectionState extends State<_AdvancedSection> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                children: [
                  Icon(Icons.tune_rounded,
                      color: Theme.of(context).colorScheme.onSurfaceVariant),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      '高级配置',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  Text(
                    _expanded ? '收起' : '展开',
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  Icon(_expanded
                      ? Icons.expand_less_rounded
                      : Icons.expand_more_rounded),
                ],
              ),
            ),
          ),
          if (_expanded) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 类型
                  DropdownButtonFormField<String>(
                    initialValue: widget.type,
                    decoration: const InputDecoration(
                      labelText: '类型',
                      prefixIcon: Icon(Icons.category_outlined),
                    ),
                    items: const [
                      DropdownMenuItem(
                          value: 'totp', child: Text('TOTP（基于时间）')),
                      DropdownMenuItem(
                          value: 'hotp', child: Text('HOTP（基于计数器）')),
                    ],
                    onChanged: (v) => widget.onTypeChanged(v!),
                  ),
                  const SizedBox(height: 12),
                  // 位数
                  DropdownButtonFormField<int>(
                    initialValue: widget.digits,
                    decoration: const InputDecoration(
                      labelText: '验证码位数',
                      prefixIcon: Icon(Icons.pin_outlined),
                    ),
                    items: [6, 8]
                        .map((d) => DropdownMenuItem(
                              value: d,
                              child: Text('$d 位'),
                            ))
                        .toList(),
                    onChanged: (v) => widget.onDigitsChanged(v!),
                  ),
                  const SizedBox(height: 12),
                  // 周期
                  DropdownButtonFormField<int>(
                    initialValue: widget.period,
                    decoration: const InputDecoration(
                      labelText: 'TOTP 刷新周期',
                      prefixIcon: Icon(Icons.timer_outlined),
                    ),
                    items: [30, 60]
                        .map((p) => DropdownMenuItem(
                              value: p,
                              child: Text('$p 秒'),
                            ))
                        .toList(),
                    onChanged: (v) => widget.onPeriodChanged(v!),
                  ),
                  const SizedBox(height: 12),
                  // 算法
                  DropdownButtonFormField<String>(
                    initialValue: widget.algorithm,
                    decoration: const InputDecoration(
                      labelText: '哈希算法',
                      prefixIcon: Icon(Icons.security_outlined),
                    ),
                    items: ['SHA1', 'SHA256', 'SHA512']
                        .map((a) => DropdownMenuItem(
                              value: a,
                              child: Text(a),
                            ))
                        .toList(),
                    onChanged: (v) => widget.onAlgorithmChanged(v!),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
