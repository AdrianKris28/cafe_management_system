package com.inn.cafe.controller;

import com.inn.cafe.constants.CafeConstants;
import com.inn.cafe.model.Role;
import com.inn.cafe.model.User;
import com.inn.cafe.service.UserService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.UserWrapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody(required = true) Map<String, String> requestMap){
        try {
            return userService.signUp(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody(required = true) Map<String, String> requestMap){

        try {
            return userService.login(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/get")
    public ResponseEntity<List<UserWrapper>> getAllUser(){
        try{
            return userService.getAllUser();
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<List<UserWrapper>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody(required = true) Map<String, String> requestMap){
        try{
            return userService.update(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/checkToken")
    public ResponseEntity<String> checkToken(){
        try {
            return userService.checkToken();
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    };

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestMap){
        try{
            return userService.changePassword(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> requestMap){
        try{
            return userService.forgotPassword(requestMap);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

//    @PostMapping("/uploadImage")
//    public ResponseEntity<String> uploadImage(@RequestPart(name = "file",required = false) MultipartFile file){
//        log.info("Inside requestparam {}", file);
//        try {
//            userService.uploadImage(file);
//            return CafeUtils.getResponseEntity("Successfully uploading the image.", HttpStatus.OK);
//        } catch (Exception e) {
//            return CafeUtils.getResponseEntity("Failed uploading the image.", HttpStatus.BAD_REQUEST);
//        }
//    }

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage2(@RequestPart(name = "file",required = false) MultipartFile file) throws IOException {
        log.info("Inside requestparam {}", file);
        System.out.println("Original Image Byte Size - " + file.getBytes().length);
        try {
            userService.uploadImage2(file);
            return CafeUtils.getResponseEntity("Successfully uploading the image.", HttpStatus.OK);
        } catch (Exception e) {
            return CafeUtils.getResponseEntity("Failed uploading the image.", HttpStatus.BAD_REQUEST);
        }
    }

//      The code above is the example if we want to retrieve the image by the path
    @GetMapping("/getImage/{email}")
    public ResponseEntity<byte[]> getImage(@PathVariable("email") String email) throws IOException {
        try {
            return userService.getImage(email);
        }catch (Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

}
