package com.inn.cafe.service;

import com.inn.cafe.JWT.CustomerUsersDetailsService;
import com.inn.cafe.JWT.JWTUtil;
import com.inn.cafe.JWT.JwtAuthenticationFilter;
import com.inn.cafe.constants.CafeConstants;
import com.inn.cafe.model.Role;
import com.inn.cafe.model.User;
import com.inn.cafe.repository.UserRepository;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtils;
import com.inn.cafe.wrapper.UserWrapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.util.zip.DataFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.swing.text.html.Option;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Slf4j
@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomerUsersDetailsService customerUsersDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailUtils emailUtils;

    public ResponseEntity<String> signUp(Map<String, String> requestMap){
//        log.info("Inside signup {}", requestMap);
        try {
            if (validateSignUpMap(requestMap)) {
                Optional<User> existingEmailUser = userRepository.findByEmail(requestMap.get("email"));
                if (existingEmailUser.isEmpty()) {
                    User user = getUserFromMap(requestMap);
                    user.setPassword(passwordEncoder.encode(requestMap.get("password")));
                    userRepository.save(user);
                    var jwtToken = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
                    return CafeUtils.getResponseEntity("Successfully Registered.", HttpStatus.CREATED);
                } else {
                    return CafeUtils.getResponseEntity("Email Already Exist", HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.BAD_REQUEST);
    }

    public boolean validateSignUpMap(Map<String, String> requestMap){
        if (requestMap.containsKey("name") && requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") && requestMap.containsKey("password")){
            return true;
        }
        return false;
    }

    public User getUserFromMap(Map<String, String> requestMap){
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setContactNumber(requestMap.get("contactNumber"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(requestMap.get("password"));
        user.setStatus("false");
        user.setRole(Role.USER);
        return user;
    }

    public ResponseEntity<String> login(Map<String, String> requestMap) {

        try {
           Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password"))
            );

           if (auth.isAuthenticated()){
               if (customerUsersDetailsService.getUserDetail().get().getStatus().equalsIgnoreCase("true")){

                   var jwtToken = jwtUtil.generateToken(customerUsersDetailsService.getUserDetail().get().getEmail(), customerUsersDetailsService.getUserDetail().get().getRole().toString());
                   return CafeUtils.getResponseEntity(jwtToken, HttpStatus.OK);
               }else{
                   return CafeUtils.getResponseEntity("User not yet approved by Admin", HttpStatus.BAD_REQUEST);
               }
           }
        }catch (Exception e){
            e.printStackTrace();
        }
       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to login");
    }

    public ResponseEntity<List<UserWrapper>> getAllUser() {
        List<User> listUser= userRepository.findAll();
        List<UserWrapper> result = new ArrayList<>();
        try {
            if (jwtAuthenticationFilter.isAdmin()){
                for (User user:listUser) {
                    UserWrapper userWrapper = new UserWrapper();
                    userWrapper.setId(user.getId());
                    userWrapper.setName(user.getName());
                    userWrapper.setStatus(user.getStatus());
                    userWrapper.setEmail(user.getEmail());
                    userWrapper.setContactNumber(user.getContactNumber());
                    userWrapper.setImage(user.getImage());
                    userWrapper.setPicByte(user.getPicByte());
                    result.add(userWrapper);
                }
                return new ResponseEntity<List<UserWrapper>>(result, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Transactional
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try {
            if (jwtAuthenticationFilter.isAdmin()){
                Optional<User> user = userRepository.findById(Integer.parseInt(requestMap.get("id")));
                if (!user.isEmpty()){
                    user.get().setStatus(requestMap.get("status"));
                    userRepository.save(user.get());
//                    sendMailToAllAdmin(requestMap.get("status"), user.get().getEmail(), userRepository.getAllAdmin());
                    return CafeUtils.getResponseEntity("User with id " + user.get().getId() + " is updated successfully", HttpStatus.OK);
                }else {
                    return CafeUtils.getResponseEntity("User id does not exist", HttpStatus.BAD_REQUEST);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendMailToAllAdmin(String status, String user, List<String> allAdmin){
        System.out.println(user);
        allAdmin.remove(jwtAuthenticationFilter.getCurrentUser());
        if (status!=null && status.equalsIgnoreCase("true")){
            emailUtils.sendSimpleMessage(user, "Account Approved", "USER:- "+user+"\n is approved by \nADMIN:-"+jwtAuthenticationFilter.getCurrentUser(), allAdmin);
        }else {
            emailUtils.sendSimpleMessage(user, "Account Disabled", "USER:- "+user+"\n is disabled by \nADMIN:-"+jwtAuthenticationFilter.getCurrentUser(), allAdmin);
        }
    }

    public ResponseEntity<String> checkToken() {
        try {
            return CafeUtils.getResponseEntity("true", HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try {
            Optional<User> user = userRepository.findByEmail(jwtAuthenticationFilter.getCurrentUser());

            if (!user.isEmpty()){

                if (passwordEncoder.matches(requestMap.get("oldPassword"), user.get().getPassword())){
                    user.get().setPassword(passwordEncoder.encode(requestMap.get("newPassword")));
                    userRepository.save(user.get());
                    return CafeUtils.getResponseEntity("Password Updated Successfully", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Incorrect Old Password", HttpStatus.BAD_REQUEST);

            }
            return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity( CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try{
            Optional<User> user = userRepository.findByEmail(requestMap.get("email"));
            if (!user.isEmpty()){
                emailUtils.forgotMail(user.get().getEmail(), "Credentials by Cafe Management System", user.get().getPassword());
                return CafeUtils.getResponseEntity("Check your mail for Credential", HttpStatus.OK);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


//    public void uploadImage(MultipartFile file) throws IOException {
//        // Save the uploaded image to a specific location on the server
//
//        log.info("Inside uploadImage {}", file);
//        String resourcesDir = "C:/Amigoscode/Cafe Management System Project/cafe/src/main/resources/";
//
//        // Create the directory if it doesn't exist
//        String uploadDir = resourcesDir + "image/";
//        File directory = new File(uploadDir);
//        if (!directory.exists()) {
//            directory.mkdirs();
//        }
//
//        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//        Path filePath = Paths.get(uploadDir, fileName);
//        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//        // Create an instance of the image entity and save it to the database
//        Optional<User> user = userRepository.findByEmail(jwtAuthenticationFilter.getCurrentUser());
//        if (user.isPresent()) {
//            user.get().setImage(filePath.toString());
//            userRepository.save(user.get());
//        }
//
//    }

    public void uploadImage2(MultipartFile file) throws IOException {

        // Create an instance of the image entity and save it to the database
        Optional<User> user = userRepository.findByEmail(jwtAuthenticationFilter.getCurrentUser());
        if (user.isPresent()) {
//            user.get().setPicByte(Base64.getEncoder().encodeToString(file.getBytes()));
            user.get().setPicByte(Base64.getEncoder().encodeToString(file.getBytes()));
            userRepository.save(user.get());
        }
    }

    public ResponseEntity<byte[]> getImage(String email) {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            byte[] image = Base64.getDecoder().decode(user.get().getPicByte());
            return new ResponseEntity<>(image, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    // compress the image bytes before storing it in the database
//    public static byte[] compressBytes(byte[] data) {
//        Deflater deflater = new Deflater();
//        deflater.setInput(data);
//        deflater.finish();
//
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
//        byte[] buffer = new byte[1024];
//        while (!deflater.finished()) {
//            int count = deflater.deflate(buffer);
//            outputStream.write(buffer, 0, count);
//        }
//        try {
//            outputStream.close();
//        } catch (IOException e) {
//        }
//        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);
//
//        return outputStream.toByteArray();
//    }

    // uncompress the image bytes before returning it to the angular application
//    public static byte[] decompressBytes(byte[] data) {
//        Inflater inflater = new Inflater();
//        inflater.setInput(data);
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
//        byte[] buffer = new byte[1024];
//        try {
//            while (!inflater.finished()) {
//                int count = inflater.inflate(buffer);
//                outputStream.write(buffer, 0, count);
//            }
//            outputStream.close();
//        } catch (IOException ioe) {
//        } catch (DataFormatException e) {
//        }
//        return outputStream.toByteArray();
//    }


}

