import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/secret_entry.dart';
import '../providers/secrets_provider.dart';

/// 编辑账户底部弹出表单
class EditSecretSheet extends StatefulWidget {
  final SecretEntry entry;

  const EditSecretSheet({super.key, required this.entry});

  @override
  State<EditSecretSheet> createState() => _EditSecretSheetState();
}

class _EditSecretSheetState extends State<EditSecretSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _accountController;
  late final TextEditingController _issuerController;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.entry.name);
    _accountController = TextEditingController(text: widget.entry.account);
    _issuerController = TextEditingController(text: widget.entry.issuer ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _accountController.dispose();
    _issuerController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final updated = widget.entry.copyWith(
      name: _nameController.text.trim(),
      account: _accountController.text.trim(),
      issuer: _issuerController.text.trim().isEmpty
          ? null
          : _issuerController.text.trim(),
    );

    final success = await context.read<SecretsProvider>().updateSecret(updated);
    if (mounted) {
      setState(() => _saving = false);
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('账户信息已更新')),
        );
      } else {
        final err = context.read<SecretsProvider>().error ?? '更新失败';
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 标题栏
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 20, 16, 0),
            child: Row(
              children: [
                const Text(
                  '编辑账户',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const Spacer(),
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
          ),
          const Divider(height: 24),
          // 表单
          Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: Column(
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: '服务名称',
                      prefixIcon: Icon(Icons.business_rounded),
                    ),
                    validator: (v) =>
                        v == null || v.trim().isEmpty ? '请输入服务名称' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _accountController,
                    decoration: const InputDecoration(
                      labelText: '账户名',
                      prefixIcon: Icon(Icons.person_outline_rounded),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _issuerController,
                    decoration: const InputDecoration(
                      labelText: '颁发者（可选）',
                      prefixIcon: Icon(Icons.verified_outlined),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
