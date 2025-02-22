package com.inn.cafe.repository;

import com.inn.cafe.model.User;
import com.inn.cafe.wrapper.UserWrapper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    List<String> getAllAdmin();
}
