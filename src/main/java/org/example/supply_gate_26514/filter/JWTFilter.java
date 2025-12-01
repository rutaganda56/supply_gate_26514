package org.example.supply_gate_26514.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.supply_gate_26514.service.JWTService;
import org.example.supply_gate_26514.service.MyUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Configuration
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private ApplicationContext context;

    @Autowired
    private JWTService jwtService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader=request.getHeader("Authorization");
        String token=null;
        String username=null;
        if(authHeader!=null && authHeader.startsWith("Bearer ")){
            token =authHeader.substring(7);
            username=jwtService.extractUserName(token);
        }
        if (username!=null&& SecurityContextHolder.getContext().getAuthentication()==null) {
            UserDetails userDetails= context.getBean(MyUserService.class).loadUserByUsername(username);
            if (jwtService.validateToken(token,userDetails));
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }
}

