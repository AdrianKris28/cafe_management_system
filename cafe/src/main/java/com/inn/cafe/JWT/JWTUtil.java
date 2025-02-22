package com.inn.cafe.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTUtil {
    private String secret = "KSr8iIOKTawrcMtGu0p9dqJXR0AndFnKCBS064tGlFpdb0IBNzmc1OXP2Pplpf/FfRJV1kpLAOUHQMkXkvyycxa9cuKQFlFIHNttHHwTwo9MvwFgncmYtJHFtYuIJuO4Iqu6fM3i9MtKpulcvXaFoc/Dx9qVbueXJcERxy6vikXn2IW1TMWjO20aTSRX2bQVkeIEzRkrNoj9K3mLqgIkzR4nk/Xi/B54Q4uIvB6XSp4gI3xjT92R/2b97MDouvP9wUtJ0KIqJaCf7rMGjJuUv7jWS6gLWUgJZN4vUgFS9MGIQU284EPID3xPVtfZeKxctokjrdtyBMKEcx0ElbTx9W480WEszyrBHhq3a7rcANE=";

    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public Date extractExpiration(String token){
        return extractClaims(token, Claims::getExpiration);
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token){
        return Jwts
                .parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, String role){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username);
    }

    public String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10 ))
                .signWith(SignatureAlgorithm.HS256, secret).compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
