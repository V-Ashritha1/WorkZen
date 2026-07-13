package taskmanagementsystem.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralizes error handling so controllers stay focused on the happy
 * path. Every handler here logs at a level appropriate to whether the
 * error is expected (client mistake -> warn) or not (server bug -> error),
 * and every response uses a consistent ErrorDetails/ValidationErrorDetails
 * shape so the frontend doesn't need special-case parsing per error type.
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFoundException exception,
                                                                          WebRequest request){
        log.warn("Resource not found: {}", exception.getMessage());
        var errorDetails = new ErrorDetails(LocalDateTime.now(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDetails> handleTaskApiException(ApiException exception, WebRequest request){
        log.warn("API exception ({}): {}", exception.getStatus(), exception.getMessage());
        var errorDetails = new ErrorDetails(LocalDateTime.now(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, exception.getStatus());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDetails> handleAccessDenied(AccessDeniedException exception, WebRequest request){
        log.warn("Access denied: {}", exception.getMessage());
        var errorDetails = new ErrorDetails(LocalDateTime.now(), "You do not have permission to perform this action", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorDetails> handleTypeMismatch(MethodArgumentTypeMismatchException exception, WebRequest request){
        String message = "Invalid value for parameter '" + exception.getName() + "'";
        log.warn(message);
        var errorDetails = new ErrorDetails(LocalDateTime.now(), message, request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception,
                                                                                       WebRequest request){
        // Return every invalid field, not just the first one, so the
        // frontend can highlight all of them in a single round trip.
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(
                error -> fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        log.warn("Validation failed: {}", fieldErrors);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timeStamp", LocalDateTime.now());
        body.put("message", "Validation failed");
        body.put("fieldErrors", fieldErrors);
        body.put("details", request.getDescription(false));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // Safety net: anything unanticipated becomes a clean 500 instead of a
    // stack trace leaking to the client, and gets logged with the full
    // trace on the server side so it's actually debuggable.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleUnexpected(Exception exception, WebRequest request){
        log.error("Unhandled exception", exception);
        var errorDetails = new ErrorDetails(LocalDateTime.now(), "Something went wrong. Please try again.", request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
