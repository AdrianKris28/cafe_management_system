package com.inn.cafe.repository;

import com.inn.cafe.model.Product;
import com.inn.cafe.wrapper.ProductWrapper;
import jakarta.persistence.NamedQuery;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    //Using @NamedQuery
    List<ProductWrapper> getAllProduct();

    @Modifying
    @Transactional
    void updateProductStatus(@Param("status")String status, @Param("id") Integer id);

    @Query("select p from Product p where p.category.id=:id and p.status='true'")
    List<Product> findByCategory(@Param("id") Integer id);
}
