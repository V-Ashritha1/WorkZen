package taskmanagementsystem.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import taskmanagementsystem.dto.ApiResponse;
import taskmanagementsystem.dto.PageResponse;
import taskmanagementsystem.dto.TaskRequest;
import taskmanagementsystem.dto.TaskResponse;
import taskmanagementsystem.model.Priority;
import taskmanagementsystem.security.CustomUserDetails;
import taskmanagementsystem.service.TaskService;

@Tag(name = "Tasks", description = "CRUD, search, filtering and pagination for the authenticated user's tasks")
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // userId never comes from the URL or the request body — it's always
    // read off the authenticated principal, which was derived from the
    // verified JWT. A client cannot create/view/edit another user's tasks.

    @Operation(summary = "Create a task for the logged-in user")
    @PostMapping
    public ResponseEntity<ApiResponse> createTask(@Valid @RequestBody TaskRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails currentUser) {
        TaskResponse created = service.createTask(request, currentUser.getId());
        return new ResponseEntity<>(new ApiResponse("Task Saved", created), HttpStatus.CREATED);
    }

    @Operation(summary = "Get a single task by id (must belong to the logged-in user)")
    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse> getTaskById(@PathVariable Integer taskId,
                                                    @AuthenticationPrincipal CustomUserDetails currentUser) {
        TaskResponse task = service.getTaskById(taskId, currentUser.getId());
        return new ResponseEntity<>(new ApiResponse("Found task", task), HttpStatus.OK);
    }

    @Operation(summary = "List the logged-in user's tasks with optional search, filters, sorting and pagination")
    @GetMapping
    public ResponseEntity<PageResponse<TaskResponse>> getAllTasks(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        PageResponse<TaskResponse> tasks = service.getTasks(
                currentUser.getId(), completed, priority, keyword, page, size, sortBy, direction);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @Operation(summary = "Update a task's title, details, priority or due date")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateTask(@PathVariable Integer id, @Valid @RequestBody TaskRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails currentUser) {
        TaskResponse updated = service.updateTask(request, id, currentUser.getId());
        return new ResponseEntity<>(new ApiResponse("Task updated!", updated), HttpStatus.OK);
    }

    @Operation(summary = "Delete a task")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTaskById(@PathVariable Integer id,
                                                  @AuthenticationPrincipal CustomUserDetails currentUser) {
        service.deleteTask(id, currentUser.getId());
        return ResponseEntity.ok("Task deleted successfully");
    }

    @Operation(summary = "Mark a task as done")
    @PatchMapping("/{id}/task-done")
    public ResponseEntity<ApiResponse> completedTodo(@PathVariable Integer id,
                                                       @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(new ApiResponse("Task done", service.doneTask(id, currentUser.getId())));
    }

    @Operation(summary = "Mark a task as pending")
    @PatchMapping("/{id}/task-pending")
    public ResponseEntity<ApiResponse> inCompletedTodo(@PathVariable Integer id,
                                                         @AuthenticationPrincipal CustomUserDetails currentUser){
        return ResponseEntity.ok(new ApiResponse("Task pending", service.pendingTask(id, currentUser.getId())));
    }
}
