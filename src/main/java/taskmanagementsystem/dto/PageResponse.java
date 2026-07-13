package taskmanagementsystem.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * A stable, framework-agnostic shape for paginated responses. Spring's
 * own Page<T> serializes fine on its own, but wrapping it means the JSON
 * shape we hand to the frontend doesn't change if we ever swap out the
 * pagination implementation.
 */
public record PageResponse<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
