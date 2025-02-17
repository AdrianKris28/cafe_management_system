package com.inn.cafe.controller;

import com.inn.cafe.constants.CafeConstants;
import com.inn.cafe.model.Category;
import com.inn.cafe.service.CategoryService;
import com.inn.cafe.utils.CafeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService service;

    @PostMapping("/add")
    public ResponseEntity<String> addNewCategory(@RequestBody Map<String, String> requestMap){
        try {
             return service.addCategory(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/get")
    public ResponseEntity<Object> getAllCategory(@RequestParam(required = false) String filterValue){
        try {
            return service.findAllCategory(filterValue);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<Object>(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/update")
    ResponseEntity<String> updateCategory(@RequestBody Map<String, String> requestMap){
        try{
            return service.updateCategory(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteCategory(@PathVariable(name = "id") Integer id){
        try {
           return service.deleteCategoryById(id);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
