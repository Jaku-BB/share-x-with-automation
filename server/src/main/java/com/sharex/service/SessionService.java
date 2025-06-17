package com.sharex.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    private static final String USER_ID_ATTRIBUTE = "userId";
    private static final String USERNAME_ATTRIBUTE = "username";

    public void createUserSession(HttpServletRequest request, String userId, String username) {
        HttpSession session = request.getSession(true);
        session.setAttribute(USER_ID_ATTRIBUTE, userId);
        session.setAttribute(USERNAME_ATTRIBUTE, username);
        session.setMaxInactiveInterval(30 * 60);
    }

    public String getCurrentUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            return (String) session.getAttribute(USER_ID_ATTRIBUTE);
        }
        return null;
    }

    public String getCurrentUsername(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            return (String) session.getAttribute(USERNAME_ATTRIBUTE);
        }
        return null;
    }

    public boolean isUserAuthenticated(HttpServletRequest request) {
        return getCurrentUserId(request) != null;
    }

    public void invalidateSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
} 