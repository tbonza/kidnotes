# Backend

This is intended to be run on Debian Linux on a Local Area Network (LAN). You
may recall LAN parties, this is a similar idea.

## Configuring the Proxy

Services sit behind HAProxy. There's an API service and a Web service for
the static files using Apache.

### Configuring Apache

#### apache.conf

change `IncludeOptional sites-enabled/*.conf` to
`IncludeOptional sites-enabled/*local.conf`.

#### sites-enabled/000-default.conf to sites-enabled/000-local.conf

change `<VirtualHost *:80>` to `<VirtualHost *:7070>`

#### ports.conf
`/etc/apache2/ports.conf`

Note that I'm ignoring the `ssl_module` and `mod_gnutls` modules for now
because I don't have a use case for ssl with a local area network at this time.

```
Listen 127.0.0.1:7070

<IfModule ssl_module>
	Listen 443
</IfModule>

<IfModule mod_gnutls.c>
	Listen 443
</IfModule>
```

### Configuring HAProxy

`/etc/haproxy/haproxy.cfg`

```
defaults
	log	global
	mode	http
	option	httplog
	option	dontlognull
        timeout connect 5000
        timeout client  50000
        timeout server  50000
	errorfile 400 /etc/haproxy/errors/400.http
	errorfile 403 /etc/haproxy/errors/403.http
	errorfile 408 /etc/haproxy/errors/408.http
	errorfile 500 /etc/haproxy/errors/500.http
	errorfile 502 /etc/haproxy/errors/502.http
	errorfile 503 /etc/haproxy/errors/503.http
	errorfile 504 /etc/haproxy/errors/504.http

frontend http_web
	bind *:80
	mode http

	acl is_api path_beg -i /api/
	use_backend api_backend if is_api

	default_backend static_backend 

backend api_backend
	mode http
	server api_server0 127.0.0.1:8080 check

backend static_backend
	mode http
	server static_server0 127.0.0.1:7070 check
```


