import { NextRequest } from 'next/server';
import is from './is';

/**
 * Parse x-forwarded-for headers.
 */
export function getClientIpFromXForwardedFor(value: any) {
    if (!is.existy(value)) {
        return null;
    }

    // @ts-ignore
    if (is.not.string(value)) {
        throw new TypeError(`Expected a string, got "${typeof value}"`);
    }

    // x-forwarded-for may return multiple IP addresses in the format:
    // "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the right-most IP address is the IP address of the most recent proxy
    // and the left-most IP address is the IP address of the originating client.
    // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
    // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
    const forwardedIps = value.split(',').map((e: string) => {
        const ip = e.trim();
        if (ip.includes(':')) {
            const splitted = ip.split(':');
            // make sure we only use this if it's ipv4 (ip:port)
            if (splitted.length === 2) {
                return splitted[0];
            }
        }
        return ip;
    });

    // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
    // Therefore taking the right-most IP address that is not unknown
    // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
    for (let i = 0; i < forwardedIps.length; i++) {
        if (is.ip(forwardedIps[i])) {
            return forwardedIps[i];
        }
    }

    // If no value in the split list is an ip, return null
    return null;
}

/**
 * Determine client IP address.
 */
export function getClientIp(req: NextRequest) {
    // Server is probably behind a proxy.
    if (req.headers) {
        // Standard headers used by Amazon EC2, Heroku, and others.
        if (is.ip(req.headers.get('x-client-ip'))) {
            return req.headers.get('x-client-ip');
        }

        // Load-balancers (AWS ELB) or proxies.
        const xForwardedFor = getClientIpFromXForwardedFor(req.headers.get('x-forwarded-for'));
        if (is.ip(xForwardedFor)) {
            return xForwardedFor;
        }

        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        if (is.ip(req.headers.get('cf-connecting-ip'))) {
            return req.headers.get('cf-connecting-ip');
        }

        // DigitalOcean.
        // @see https://www.digitalocean.com/community/questions/app-platform-client-ip
        // DO-Connecting-IP - applied to app platform servers behind a proxy.
        if (is.ip(req.headers.get('do-connecting-ip'))) {
            return req.headers.get('do-connecting-ip');
        }

        // Fastly and Firebase hosting header (When forwared to cloud function)
        if (is.ip(req.headers.get('fastly-client-ip'))) {
            return req.headers.get('fastly-client-ip');
        }

        // Akamai and Cloudflare: True-Client-IP.
        if (is.ip(req.headers.get('true-client-ip'))) {
            return req.headers.get('true-client-ip');
        }

        // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
        if (is.ip(req.headers.get('x-real-ip'))) {
            return req.headers.get('x-real-ip');
        }

        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        if (is.ip(req.headers.get('x-cluster-client-ip'))) {
            return req.headers.get('x-cluster-client-ip');
        }

        if (is.ip(req.headers.get('x-forwarded'))) {
            return req.headers.get('x-forwarded');
        }

        if (is.ip(req.headers.get('forwarded-for'))) {
            return req.headers.get('forwarded-for');
        }

        if (is.ip(req.headers.get('forwarded'))) {
            return req.headers.get('forwarded');
        }

        // Google Cloud App Engine
        // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers

        if (is.ip(req.headers.get('x-appengine-user-ip'))) {
            return req.headers.get('x-appengine-user-ip');
        }

        // Cloudflare fallback
        // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
        if (is.ip(req.headers.get('Cf-Pseudo-IPv4'))) {
            return req.headers.get('Cf-Pseudo-IPv4');
        }
    }
}
