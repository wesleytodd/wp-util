<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */
 
// Include local configuration
if (file_exists(dirname(__FILE__) . '/local-config.php')) {
	include(dirname(__FILE__) . '/local-config.php');
}

// Global DB config
if (!defined('DB_NAME')) {
	define('DB_NAME', 'test_db');
}
if (!defined('DB_USER')) {
	define('DB_USER', 'test_user');
}
if (!defined('DB_PASSWORD')) {
	define('DB_PASSWORD', 'test_pass');
}
if (!defined('DB_HOST')) {
	define('DB_HOST', 'test_host');
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'cCHH!5Gz|1V5bY_3,=i]h=iLQC_C*  {+=D-rd~nGP[d:Kct=q>bqep+Ukb 8S?e');
define('SECURE_AUTH_KEY',  'Lo+2a-n*liyNQEgtg]]>)E]$;gieNzxhkC@mSDcF#W.D^7omAmLQ6FsvO!(2(YN,');
define('LOGGED_IN_KEY',    'W1%FhbA}rHAeEB:bVOG(qf-02,2F|CA5ez|JI.Q XF%w_];|-5s*dl(%3}J9i2_K');
define('NONCE_KEY',        'ihaW[AI8nXg.REQWDL8A(5*pozR=j!$4r!XeLN?X2_XpI4~QX$A|*4D||:)kEEk_');
define('AUTH_SALT',        'U IQ&_{GU|a(00]}-_)P@F65+t[kDDWE+IK;HV7kj4-Id&*U8Q:X<>I=I6XE-*o,');
define('SECURE_AUTH_SALT', 'a`Jmw+9.$Q[|;Mwv5]An{J-n/K-s#RK^<d8]Ul;t>M.V&DE6>c:yf;W|j?rPp8c.');
define('LOGGED_IN_SALT',   '{YQG!dw_dL|8:W9+q6%&S-<Os0VCtU2c?g;44xEU#c0?ZHIHo}lm%MtIpfRPSg|z');
define('NONCE_SALT',       'nPc+N9)%7P|fk`bMBVJ>&.?s w:4462wA#Cy^;GW*qmD=<NBsH6}^3+4T-|(`xyN');
/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', 'es_ES');

/**
 * Set custom paths
 *
 * These are required because wordpress is installed in a subdirectory.
 */
define('WP_SITEURL', 'http://' . $_SERVER['SERVER_NAME'] . ':80/wordpress');
define('WP_HOME',    'http://' . $_SERVER['SERVER_NAME'] . ':80');
define('WP_CONTENT_DIR', __dir__ . '/content');
define('WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . ':80/content');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
if (!defined('WP_DEBUG')) {
	define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
