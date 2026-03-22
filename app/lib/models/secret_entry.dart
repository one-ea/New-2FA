/// 2FA 密钥数据模型（与服务端 API 字段对齐）
class SecretEntry {
  final String id;
  final String name;      // 服务名称（如 Google）
  final String account;   // 账户名（如 user@example.com）
  final String secret;    // Base32 密钥
  final String type;      // totp / hotp
  final int digits;       // 验证码位数（6 或 8）
  final int period;       // TOTP 刷新周期（通常 30 秒）
  final String algorithm; // SHA1 / SHA256 / SHA512
  final int? counter;     // HOTP 计数器
  final String? issuer;   // 颁发者（如 google.com）
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const SecretEntry({
    required this.id,
    required this.name,
    required this.account,
    required this.secret,
    this.type = 'totp',
    this.digits = 6,
    this.period = 30,
    this.algorithm = 'SHA1',
    this.counter,
    this.issuer,
    this.createdAt,
    this.updatedAt,
  });

  /// 用于图标加载的域名（优先 issuer，回退 name）
  String get iconDomain {
    if (issuer != null && issuer!.isNotEmpty) return issuer!;
    // 尝试从 name 推断域名（AlibabaCloud -> alibabacloud.com）
    return name.toLowerCase().replaceAll(' ', '');
  }

  factory SecretEntry.fromJson(Map<String, dynamic> json) {
    return SecretEntry(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      account: json['account']?.toString() ?? '',
      secret: json['secret']?.toString() ?? '',
      type: json['type']?.toString() ?? 'totp',
      digits: (json['digits'] as num?)?.toInt() ?? 6,
      period: (json['period'] as num?)?.toInt() ?? 30,
      algorithm: json['algorithm']?.toString() ?? 'SHA1',
      counter: (json['counter'] as num?)?.toInt(),
      issuer: json['issuer']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id.isNotEmpty) 'id': id,
      'name': name,
      'account': account,
      'secret': secret,
      'type': type,
      'digits': digits,
      'period': period,
      'algorithm': algorithm,
      if (counter != null) 'counter': counter,
      if (issuer != null) 'issuer': issuer,
    };
  }

  /// 从 otpauth:// URI 解析
  /// 格式：otpauth://totp/Issuer:account?secret=XXX&issuer=YYY&digits=6&period=30
  factory SecretEntry.fromOtpAuthUri(String uri) {
    final parsed = Uri.parse(uri);
    if (parsed.scheme != 'otpauth') {
      throw FormatException('无效的 otpauth URI: $uri');
    }

    final type = parsed.host; // totp 或 hotp
    final pathLabel = Uri.decodeComponent(parsed.path.substring(1)); // 去掉开头 /

    String issuer = '';
    String account = pathLabel;

    // 解析 "Issuer:account" 格式
    if (pathLabel.contains(':')) {
      final parts = pathLabel.split(':');
      issuer = parts[0].trim();
      account = parts.sublist(1).join(':').trim();
    }

    final params = parsed.queryParameters;
    final secret = params['secret'] ?? '';
    final issuerParam = params['issuer'] ?? issuer;
    final name = issuerParam.isNotEmpty ? issuerParam : account;

    return SecretEntry(
      id: '',
      name: name,
      account: account,
      secret: secret.toUpperCase().replaceAll(' ', ''),
      type: type,
      digits: int.tryParse(params['digits'] ?? '6') ?? 6,
      period: int.tryParse(params['period'] ?? '30') ?? 30,
      algorithm: params['algorithm']?.toUpperCase() ?? 'SHA1',
      counter: int.tryParse(params['counter'] ?? ''),
      issuer: issuerParam.isNotEmpty ? issuerParam : null,
    );
  }

  SecretEntry copyWith({
    String? id,
    String? name,
    String? account,
    String? secret,
    String? type,
    int? digits,
    int? period,
    String? algorithm,
    int? counter,
    String? issuer,
  }) {
    return SecretEntry(
      id: id ?? this.id,
      name: name ?? this.name,
      account: account ?? this.account,
      secret: secret ?? this.secret,
      type: type ?? this.type,
      digits: digits ?? this.digits,
      period: period ?? this.period,
      algorithm: algorithm ?? this.algorithm,
      counter: counter ?? this.counter,
      issuer: issuer ?? this.issuer,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is SecretEntry && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
