package taskmanagementsystem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import taskmanagementsystem.model.Priority;
import taskmanagementsystem.model.Task;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    /**
     * One flexible query backs search + filter + pagination for the task
     * list instead of a separate endpoint/method per combination. Any of
     * completed/priority/keyword can be null, in which case that
     * condition is skipped.
     */
    @Query("""
            SELECT t FROM Task t
            WHERE t.user.id = :userId
              AND (:completed IS NULL OR t.completed = :completed)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:keyword IS NULL
                   OR LOWER(t.task) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(t.details) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Task> search(
            @Param("userId") Long userId,
            @Param("completed") Boolean completed,
            @Param("priority") Priority priority,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
