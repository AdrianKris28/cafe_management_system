package com.inn.cafe.repository;

import com.inn.cafe.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Integer> {

    List<Bill> findBillByCreatedbyOrderByIdDesc(String currentUser);
}
