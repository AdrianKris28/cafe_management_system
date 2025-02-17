package com.inn.cafe.service;

import com.google.common.base.Strings;
import com.inn.cafe.JWT.JwtAuthenticationFilter;
import com.inn.cafe.constants.CafeConstants;
import com.inn.cafe.model.Category;
import com.inn.cafe.repository.CategoryRepository;
import com.inn.cafe.utils.CafeUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.*;

@Slf4j
@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Transactional
    public ResponseEntity<String> addCategory(Map<String, String> requestMap) {
        try {
            if (jwtAuthenticationFilter.isAdmin()){
                Category category = new Category();
                category.setName(requestMap.get("name"));
                repository.save(category);
                return CafeUtils.getResponseEntity("Category " + category.getName() + " created successfully", HttpStatus.CREATED);
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<Object> findAllCategory(String filterValue) {
        try {
            if (!Strings.isNullOrEmpty(filterValue) && filterValue.equalsIgnoreCase("true")){
                log.info("Inside if");
                List<Category> categoryList = new ArrayList<>();
                categoryList = repository.getAllCategory();
                return new ResponseEntity<Object>(categoryList, HttpStatus.OK);
            }
            return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<Object>(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Transactional
    public ResponseEntity<String> updateCategory(Map<String, String> requestMap) {
        try{
            if (jwtAuthenticationFilter.isAdmin()){
                if (Objects.isNull(requestMap.get("id"))){
                    return CafeUtils.getResponseEntity("You have to insert the id", HttpStatus.BAD_REQUEST);
                } else if (repository.findById(Integer.parseInt(requestMap.get("id"))).isEmpty()) {
                    return CafeUtils.getResponseEntity("There is no category with id "+requestMap.get("id"), HttpStatus.BAD_REQUEST);
                }else {
                    Optional<Category> updatedCategory = repository.findById(Integer.parseInt(requestMap.get("id")));
                    updatedCategory.get().setName(requestMap.get("name"));
                    repository.save(updatedCategory.get());
                    return CafeUtils.getResponseEntity("Successfully updating category name", HttpStatus.OK);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> deleteCategoryById(Integer id) {
        try {
           Optional<Category> category = repository.findById(id);
           if (category.isEmpty()) {
               return CafeUtils.getResponseEntity("The category with Id " + id + " does not exist.", HttpStatus.BAD_REQUEST);
           }else {
               repository.deleteById(id);
               return CafeUtils.getResponseEntity("Successfully delete category with Id " + id, HttpStatus.OK);
           }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
