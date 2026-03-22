import 'dart:math';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:base32/base32.dart';

/// TOTP/HOTP 本地计算引擎
/// 完全离线，不依赖网络，算法符合 RFC 6238
class OtpEngine {
  /// 生成当前 TOTP 验证码
  static String generateTotp({
    required String secret,
    int digits = 6,
    int period = 30,
    String algorithm = 'SHA1',
    DateTime? time,
  }) {
    final now = time ?? DateTime.now();
    final counter = now.millisecondsSinceEpoch ~/ 1000 ~/ period;
    return _hotp(secret: secret, counter: counter, digits: digits, algorithm: algorithm);
  }

  /// 生成下一个 TOTP 验证码
  static String generateNextTotp({
    required String secret,
    int digits = 6,
    int period = 30,
    String algorithm = 'SHA1',
  }) {
    final now = DateTime.now();
    final counter = (now.millisecondsSinceEpoch ~/ 1000 ~/ period) + 1;
    return _hotp(secret: secret, counter: counter, digits: digits, algorithm: algorithm);
  }

  /// 当前 TOTP 周期剩余秒数（0~period-1）
  static int remainingSeconds({int period = 30}) {
    final epochSeconds = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    return period - (epochSeconds % period);
  }

  /// 当前周期进度（0.0~1.0，从 1.0 递减到 0.0）
  static double remainingProgress({int period = 30}) {
    return remainingSeconds(period: period) / period;
  }

  /// HOTP 算法（RFC 4226）
  static String _hotp({
    required String secret,
    required int counter,
    int digits = 6,
    String algorithm = 'SHA1',
  }) {
    // Base32 解码密钥
    final Uint8List key;
    try {
      // 清理密钥：去除空格，转大写，补齐 padding
      final cleaned = secret.toUpperCase().replaceAll(' ', '').replaceAll('-', '');
      key = base32.decode(cleaned);
    } catch (e) {
      return '------';
    }

    // 将计数器转换为 8 字节大端序
    final counterBytes = Uint8List(8);
    var c = counter;
    for (int i = 7; i >= 0; i--) {
      counterBytes[i] = c & 0xff;
      c >>= 8;
    }

    // HMAC 计算
    final hmac = _hmac(algorithm, key, counterBytes);

    // 动态截断（Dynamic Truncation）
    final offset = hmac.last & 0x0f;
    final truncated = ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

    final otp = truncated % pow(10, digits).toInt();
    return otp.toString().padLeft(digits, '0');
  }

  static List<int> _hmac(String algorithm, List<int> key, List<int> data) {
    final Hmac hmac;
    switch (algorithm.toUpperCase()) {
      case 'SHA256':
        hmac = Hmac(sha256, key);
        break;
      case 'SHA512':
        hmac = Hmac(sha512, key);
        break;
      default: // SHA1
        hmac = Hmac(sha1, key);
    }
    return hmac.convert(data).bytes;
  }

  /// 验证用户输入的 OTP（前后各允许一个时间窗口偏差）
  static bool verifyTotp({
    required String secret,
    required String userOtp,
    int digits = 6,
    int period = 30,
    String algorithm = 'SHA1',
    int window = 1,
  }) {
    if (userOtp.length != digits) return false;
    final now = DateTime.now();
    final currentCounter = now.millisecondsSinceEpoch ~/ 1000 ~/ period;

    for (int i = -window; i <= window; i++) {
      final otp = _hotp(
        secret: secret,
        counter: currentCounter + i,
        digits: digits,
        algorithm: algorithm,
      );
      if (otp == userOtp) return true;
    }
    return false;
  }
}


