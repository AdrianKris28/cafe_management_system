package com.inn.cafe.service;

import com.inn.cafe.repository.BillRepository;
import com.inn.cafe.repository.CategoryRepository;
import com.inn.cafe.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class DashboardService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BillRepository billRepository;

    public ResponseEntity<Map<String, Object>> getCount() {
        Map<String, Object> map = new HashMap<>();
        map.put("category", categoryRepository.count());
        map.put("product", productRepository.count());
        map.put("bill", billRepository.count());
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
