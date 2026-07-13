package taskmanagementsystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {


        // Allow CORS preflight requests to pass
        if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }


        String header = request.getHeader("Authorization");


        // No JWT token → continue normally
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        String token = header.substring(7);


        if (jwtUtil.isTokenValid(token)) {

            Long userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);


            CustomUserDetails principal = new CustomUserDetails();

            principal.setId(userId);
            principal.setUsername(username);
            principal.setAuthorities(
                    List.of(new SimpleGrantedAuthority(role))
            );


            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            principal.getAuthorities()
                    );


            authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );


            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authToken);
        }


        filterChain.doFilter(request, response);
    }
}