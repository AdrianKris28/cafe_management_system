package com.inn.cafe.repository;

import com.inn.cafe.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    //Using @NamedQuery
    List<Category> getAllCategory();
}
