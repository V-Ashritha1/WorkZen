package taskmanagementsystem.initilizer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import taskmanagementsystem.model.Priority;
import taskmanagementsystem.model.Task;
import taskmanagementsystem.model.User;
import taskmanagementsystem.repository.TaskRepository;
import taskmanagementsystem.repository.UserRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class InitDatabase implements CommandLineRunner {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.findAll().isEmpty()) {
            return;
        }

        List<User> users = Arrays.asList(
                new User(1L, "admin", "admin@gmail.com", passwordEncoder.encode("admin"), "ADMIN", null),
                new User(2L, "user", "user@gmail.com", passwordEncoder.encode("user"), "USER", null)
        );
        userRepository.saveAll(users);
        log.info("Database initialized with default users");

        User demoUser = users.get(1);
        taskRepository.saveAll(List.of(
                seedTask("Finish resume portfolio", "Wrap up all four projects and proofread bullet points",
                        Priority.HIGH, LocalDate.now().plusDays(2), demoUser),
                seedTask("Prepare for mock interview", "Review common DSA + system design questions",
                        Priority.MEDIUM, LocalDate.now().plusDays(5), demoUser),
                seedTask("Read Spring Security docs", "Focus on JWT filters and method security",
                        Priority.LOW, LocalDate.now().plusDays(10), demoUser)
        ));
        log.info("Database initialized with sample tasks");
    }

    private Task seedTask(String title, String details, Priority priority, LocalDate dueDate, User user) {
        Task task = new Task();
        task.setTask(title);
        task.setDetails(details);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        task.setCompleted(false);
        task.setUser(user);
        return task;
    }
}
