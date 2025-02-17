package com.inn.cafe.service;

import com.inn.cafe.JWT.JwtAuthenticationFilter;
import com.inn.cafe.constants.CafeConstants;
import com.inn.cafe.model.Category;
import com.inn.cafe.model.Product;
import com.inn.cafe.model.User;
import com.inn.cafe.repository.CategoryRepository;
import com.inn.cafe.repository.ProductRepository;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.ProductWrapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    ModelMapper modelMapper = new ModelMapper();

    public ResponseEntity<String> addProduct(Map<String, String> requestMap){
        try{
            Product newProduct = new Product();
            if (jwtAuthenticationFilter.isAdmin()){
                if (requestMap.containsKey("name") && requestMap.containsKey("categoryId") && requestMap.containsKey("description") && requestMap.containsKey("price")){
                    System.out.println(requestMap);
                    newProduct = getProductFromMap(requestMap);
                    repository.save(newProduct);
                    return CafeUtils.getResponseEntity("Successfully add new product", HttpStatus.CREATED);
                }
                return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Product getProductFromMap(Map<String, String> requestMap) {
        Category category = new Category();
        category.setId(Integer.parseInt(requestMap.get("categoryId")));
        Product product = new Product();
        if (requestMap.containsKey("id")){
            product.setId(Integer.parseInt(requestMap.get("id")));
        }
        product.setName(requestMap.get("name"));
        product.setCategory(category);
        product.setStatus("true");
        product.setDescription(requestMap.get("description"));
        product.setPrice(Integer.parseInt(requestMap.get("price")));
        return product;
    }

    public ResponseEntity<List<ProductWrapper>> getAllProduct() {
        try {
            List<Product> productList = repository.findAll();
            List<ProductWrapper> productWrapperList = new ArrayList<>();
            for (Product product: productList) {
                ProductWrapper productWrapper = modelMapper.map(product, ProductWrapper.class);
//                productWrapper.setCategoryName(categoryRepository.findById(product.getCategory().getId()).get().getName());
                productWrapper.setCategoryName(product.getCategory().getName());
                productWrapperList.add(productWrapper);
            }
            //Line of code below is using @NamedQuery to get all ProductWrapper list
//            productWrapperList = repository.getAllProduct();

            return new ResponseEntity<>(productWrapperList, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Transactional
    public ResponseEntity<String> updateProduct(Map<String, String> requestMap) {
        try{
            if (jwtAuthenticationFilter.isAdmin()){
                if (requestMap.containsKey("id") && requestMap.containsKey("name") && requestMap.containsKey("categoryId") && requestMap.containsKey("description") && requestMap.containsKey("price")){
                    Optional<Product> product = repository.findById(Integer.parseInt(requestMap.get("id")));
                    if (product.isEmpty()){
                        return CafeUtils.getResponseEntity("There is no product with id "+ requestMap.get("id"), HttpStatus.BAD_REQUEST);
                    } else if (product.isPresent()) {
                        Product updatedProduct = new Product();
                        updatedProduct = getProductFromMap(requestMap);
                        updatedProduct.setStatus(product.get().getStatus());
                        repository.save(updatedProduct);
                        return CafeUtils.getResponseEntity("Product with id "+ updatedProduct.getId() + " updated successfully", HttpStatus.OK);
                    }
                }else {
                    return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Transactional
    public ResponseEntity<String> deleteProduct(Integer id) {
        try {
            if (jwtAuthenticationFilter.isAdmin()){
                Optional<Product> deletedProduct = repository.findById(id);
                if (deletedProduct.isEmpty()){
                    return CafeUtils.getResponseEntity("There is no product with id "+ id, HttpStatus.BAD_REQUEST);
                } else if (deletedProduct.isPresent()) {
                    repository.deleteById(id);
                    return CafeUtils.getResponseEntity("Successfully deleting product with id " + id, HttpStatus.OK);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Transactional
    public ResponseEntity<String> updateStatus(Map<String, String> requestMap) {
        try {
            if (jwtAuthenticationFilter.isAdmin()){
                if (requestMap.containsKey("id") && requestMap.containsKey("status")) {
                    Optional<Product> product = repository.findById(Integer.parseInt(requestMap.get("id")));
                    if (product.isPresent()) {
                        product.get().setStatus(requestMap.get("status"));
                        repository.save(product.get());

                        //Alternative way using @NamedQuery
//                        repository.updateProductStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));

                        return CafeUtils.getResponseEntity("Product status with id " + product.get().getId() + " updated successfully", HttpStatus.OK);
                    }
                }
                return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<List<ProductWrapper>> getByCategory(Integer id) {
        try {
            List<Product> productList = new ArrayList<>();
            List<ProductWrapper> productWrapperList = new ArrayList<>();
            productList = repository.findByCategory(id);
            if (productList.size()>0) {
                for (Product product : productList) {
                    ProductWrapper productWrapper = modelMapper.map(product, ProductWrapper.class);
                    productWrapper.setCategoryName(product.getCategory().getName());
                    productWrapperList.add(productWrapper);
                }
                return new ResponseEntity<>(productWrapperList, HttpStatus.OK);
            }
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<ProductWrapper> getProductById(Integer id) {
        try {
            Optional<Product> product = repository.findById(id);
            ProductWrapper productWrapper = new ProductWrapper();

            if (product.isPresent()){
                productWrapper = modelMapper.map(product.get(), ProductWrapper.class);
//                log.info("Inside productWrapper {}", productWrapper);
                return new ResponseEntity<>(productWrapper, HttpStatus.OK);
            }
            return new ResponseEntity<>(new ProductWrapper(), HttpStatus.BAD_REQUEST);

        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ProductWrapper(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> uploadImage(MultipartFile file, Integer id) {
        try {
            log.info("Inside ProductService uploadImage file {}", file);
           Optional<Product> product = repository.findById(id);
           if (product.isPresent()){
               product.get().setImage(Base64.getEncoder().encodeToString(file.getBytes()));
               repository.save(product.get());
               return CafeUtils.getResponseEntity("Successfully uploading the image", HttpStatus.OK);
           }else {
               return CafeUtils.getResponseEntity("There is no product with Id: " + id, HttpStatus.BAD_REQUEST);
           }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    public ResponseEntity<byte[]> getImage(Integer id) {
        try {
            Optional<Product> product = repository.findById(id);
            byte[] image = Base64.getDecoder().decode(product.get().getImage());
            return new ResponseEntity<>(image, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
