import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// 添加账户菜单（底部弹出）
class AddMenuSheet extends StatelessWidget {
  const AddMenuSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(24, 8, 24, 16),
          child: Text(
            '添加账户',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
        ),

        // 扫描二维码
        ListTile(
          leading: Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.qr_code_scanner_rounded,
              color: Theme.of(context).colorScheme.onPrimaryContainer,
            ),
          ),
          title: const Text('扫描二维码'),
          subtitle: const Text('使用摄像头扫描服务提供的 QR 码'),
          onTap: () {
            Navigator.pop(context);
            context.push('/home/scan');
          },
        ),

        const SizedBox(height: 8),

        // 手动输入
        ListTile(
          leading: Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.secondaryContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.keyboard_rounded,
              color: Theme.of(context).colorScheme.onSecondaryContainer,
            ),
          ),
          title: const Text('手动输入'),
          subtitle: const Text('输入服务名称和密钥'),
          onTap: () {
            Navigator.pop(context);
            context.push('/home/add');
          },
        ),

        const SizedBox(height: 24),
      ],
    );
  }
}
