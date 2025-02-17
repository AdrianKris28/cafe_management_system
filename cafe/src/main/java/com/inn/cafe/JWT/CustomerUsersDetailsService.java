package com.inn.cafe.JWT;

import com.inn.cafe.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Slf4j
@Service
public class CustomerUsersDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private Optional<com.inn.cafe.model.User> userDetail;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        log.info("Inside loadUserByUsername {}", username);
        userDetail = userRepository.findByEmail(username);
        if (userDetail.isPresent()){
            return new User(userDetail.get().getEmail(), userDetail.get().getPassword(), new ArrayList<>());
        }else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    public  Optional<com.inn.cafe.model.User> getUserDetail(){
        return userDetail;
    }
}
