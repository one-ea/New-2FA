import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

/// 二维码扫描页
/// 扫描成功后解析 otpauth:// URI 并跳转到添加页
class ScanQrScreen extends StatefulWidget {
  const ScanQrScreen({super.key});

  @override
  State<ScanQrScreen> createState() => _ScanQrScreenState();
}

class _ScanQrScreenState extends State<ScanQrScreen> {
  final MobileScannerController _controller = MobileScannerController(
    facing: CameraFacing.back,
    detectionSpeed: DetectionSpeed.normal,
  );
  bool _scanned = false;
  bool _torchOn = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_scanned) return;
    final barcodes = capture.barcodes;

    for (final barcode in barcodes) {
      final raw = barcode.rawValue;
      if (raw != null && raw.startsWith('otpauth://')) {
        _scanned = true;
        _controller.stop();
        // 跳转到添加页，传入解析好的 URI
        if (mounted) {
          final encoded = Uri.encodeComponent(raw);
          context.pushReplacement('/home/add?uri=$encoded');
        }
        return;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('扫描二维码'),
        actions: [
          // 闪光灯
          IconButton(
            onPressed: () async {
              await _controller.toggleTorch();
              setState(() => _torchOn = !_torchOn);
            },
            icon: Icon(
              _torchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
              color: _torchOn ? Colors.yellow : Colors.white,
            ),
          ),
          // 翻转摄像头
          IconButton(
            onPressed: () => _controller.switchCamera(),
            icon: const Icon(Icons.flip_camera_ios_rounded, color: Colors.white),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 摄像头预览
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),

          // 扫描框遮罩
          CustomPaint(
            size: Size.infinite,
            painter: _ScanOverlayPainter(colors.primary),
          ),

          // 底部提示
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [Colors.black.withOpacity(0.8), Colors.transparent],
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.qr_code_rounded, color: Colors.white, size: 32),
                  const SizedBox(height: 8),
                  const Text(
                    '将 QR 码对准扫描框',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '支持 TOTP / HOTP 格式',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.6),
                      fontSize: 13,
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

/// 扫描框 Overlay 画布
class _ScanOverlayPainter extends CustomPainter {
  final Color accentColor;

  const _ScanOverlayPainter(this.accentColor);

  @override
  void paint(Canvas canvas, Size size) {
    const boxSize = 260.0;
    const cornerLen = 32.0;
    const cornerRadius = 4.0;
    const cornerWidth = 4.0;

    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final left = centerX - boxSize / 2;
    final top = centerY - boxSize / 2 - 40;
    final right = left + boxSize;
    final bottom = top + boxSize;
    final rect = Rect.fromLTRB(left, top, right, bottom);

    // 半透明遮罩（排除扫描区域）
    final maskPaint = Paint()
      ..color = Colors.black.withOpacity(0.55)
      ..blendMode = BlendMode.srcOver;

    final path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(RRect.fromRectAndRadius(rect, const Radius.circular(16)))
      ..fillType = PathFillType.evenOdd;
    canvas.drawPath(path, maskPaint);

    // 扫描框边角
    final cornerPaint = Paint()
      ..color = accentColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = cornerWidth
      ..strokeCap = StrokeCap.round;

    // 左上角
    canvas.drawLine(Offset(left, top + cornerLen), Offset(left, top + cornerRadius), cornerPaint);
    canvas.drawLine(Offset(left, top), Offset(left + cornerLen, top), cornerPaint);
    // 右上角
    canvas.drawLine(Offset(right - cornerLen, top), Offset(right, top), cornerPaint);
    canvas.drawLine(Offset(right, top), Offset(right, top + cornerLen), cornerPaint);
    // 左下角
    canvas.drawLine(Offset(left, bottom - cornerLen), Offset(left, bottom), cornerPaint);
    canvas.drawLine(Offset(left, bottom), Offset(left + cornerLen, bottom), cornerPaint);
    // 右下角
    canvas.drawLine(Offset(right - cornerLen, bottom), Offset(right, bottom), cornerPaint);
    canvas.drawLine(Offset(right, bottom - cornerLen), Offset(right, bottom), cornerPaint);
  }

  @override
  bool shouldRepaint(_ScanOverlayPainter old) => old.accentColor != accentColor;
}
