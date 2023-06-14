package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserService userService;

    private List<User> users;

    @Test
    public void itShouldFindAnExistingUser(){
        long testedId = 1;
        User expectedUser = users.get(0);

        given(userRepository.findById(testedId)).willReturn(Optional.ofNullable(users.get(0)));
        User receivedUser = userService.findById(testedId);
        assertThat(receivedUser)
                .isNotNull()
                .isEqualTo(expectedUser);
    }

    @Test
    public void itShouldNotFindANonExistingUser(){
        given(userRepository.findById(10L)).willReturn(Optional.empty());
        assertThat( userService.findById(10L)).isNull();
    }

    @Test
    public void itShouldCallDelete(){
        userService.delete(1L);
        verify(userRepository).deleteById(1L);
    }

    @BeforeEach
    public void setup() {
        this.users = new ArrayList<>();
        User u1 = new User();
        User u2 = new User();
        u1.setId((long) 1).setAdmin(false).setFirstName("John").setLastName("Doe");
        u2.setId((long) 2).setAdmin(false).setFirstName("Jane").setLastName("Doe");

        users.add(u1);
        users.add(u2);
    }

}
