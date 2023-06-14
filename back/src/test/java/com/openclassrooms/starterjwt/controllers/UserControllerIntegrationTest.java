package com.openclassrooms.starterjwt.controllers;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    private String token;

    private String testUserToken;
    private int testUserId;

    @BeforeAll
    public void getFirstAccToken() throws Exception {
        String email = "yoga@studio.com";
        String password = "test!1234";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @BeforeAll
    public void createTestUser() throws Exception {
        String email =  "test@test.com";
        String password ="test!1234";
        String lastName  ="admin";
        String firstName  ="admin";
        String requestBody = "{" +
                "\"email\": \"" + email + "\"," +
                "\"password\": \"" + password + "\"," +
                "\"firstName\": \"" + firstName + "\"," +
                "\"lastName\": \"" + lastName + "\"" +
                "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody));

        String loginRequest = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        String result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andReturn()
                .getResponse()
                .getContentAsString();

        testUserToken = "Bearer " + JsonPath.read(result, "$.token");
        testUserId = JsonPath.read(result, "$.id");
    }

    @Test
    public void itShouldFindAnExistingUser() throws Exception {
        mockMvc.perform(get("/api/user/1").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("lastName", is("Admin")));
    }

    @Test
    public void itShouldRespondNotFoundIfTryingToFindNonExistingUser() throws Exception {
        mockMvc.perform(get("/api/user/10000").header("Authorization", token))
                .andExpect(status().isNotFound());
    }

    @Test
    public void itShouldThrowBadRequestIfFindingUserWithWrongIdFormat() throws Exception {
        mockMvc.perform(get("/api/user/notavalidid").header("Authorization", token))
                .andExpect(status().isBadRequest());
    }


    @Test
    public void itShouldThrowUnauthorizedIfTryingToDeleteAnotherExistingUser() throws Exception {
        mockMvc.perform(delete("/api/user/3").header("Authorization", token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void itShouldThrowNotFoundIfTryingToDeleteNonExistingUser() throws Exception {
        mockMvc.perform(delete("/api/user/10000").header("Authorization", token))
                .andExpect(status().isNotFound());
    }

    @Test
    public void itShouldThrowBadRequestIfDeletingUserWithWrongIdFormat() throws Exception {
        mockMvc.perform(delete("/api/user/notavalidid").header("Authorization", token))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void itShouldDeleteTheUser() throws Exception {
        mockMvc.perform(delete("/api/user/" + testUserId).header("Authorization", testUserToken)).andExpect(status().isOk());
    }
}
