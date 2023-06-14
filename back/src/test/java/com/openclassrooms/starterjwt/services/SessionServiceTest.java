package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.function.Executable;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    SessionRepository sessionRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    SessionService sessionService;

    private List<Session> sessionList;

    @Test
    public void itShouldFindAllAvailableSessions() {
        given(sessionRepository.findAll()).willReturn(sessionList);
        List<Session> receivedSessions = sessionService.findAll();

        assertThat(receivedSessions).isEqualTo(sessionList);
    }

    @Test
    public void itShouldFindASession() {
        long testedId = 1;
        Optional<Session> expectedSession = Optional.of(sessionList.get(0));
        given(sessionRepository.findById(testedId)).willReturn(expectedSession);
        Session receivedSession = sessionService.getById(testedId);

        assertThat(receivedSession).isEqualTo(sessionList.get(0));
    }

    @Test
    public void ItShouldCreateASession(){
        Session session = new Session();
        given(sessionRepository.save(session)).willReturn(session);
        Session receivedSession = sessionService.create(session);

        assertThat(receivedSession).isEqualTo(session);
    }

    @Test
    public void itShouldUpdateASession(){
        Session session = sessionList.get(0);
        session.setName("Test");
        session.setDescription("Description Test");
        given(sessionRepository.save(session)).willReturn(sessionList.get(0));
        Session received = sessionService.update((long)1, session);
        assertThat(received).isEqualTo(session);
    }

    @Test
    public void itShouldCallTheDeleteMethod(){
        sessionService.delete((long) 10);
        verify(sessionRepository).deleteById(10L);
    }

    @Test
    public void itShouldThrowNotFoundWhenParticipatingToUnkownSession() {
        long sessionId = 5;
        long userId = 4;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.empty());
        Assertions.assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    public void itShouldThrowNotFoundWhenUserDoesNotExist(){
        long sessionId = 5;
        long userId = 4;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.ofNullable(sessionList.get(0)));
        given(userRepository.findById(userId)).willReturn(Optional.empty());
        Assertions.assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    public void itShouldThrowBadRequestIfUserAlreadyParticipates(){
        long sessionId = 5;
        long userId = 1;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.ofNullable(sessionList.get(0)));
        given(userRepository.findById(userId)).willReturn(Optional.of(new User()));
        Assertions.assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    public void itShouldAddANewParticipant(){
        long sessionId = 5;
        long userId = 10;
        int previousSize = sessionList.get(0).getUsers().size();
        given(sessionRepository.findById(sessionId)).willReturn(Optional.ofNullable(sessionList.get(0)));
        given(userRepository.findById(userId)).willReturn(Optional.of(new User()));
        sessionService.participate(sessionId, userId);

        assertThat(sessionList.get(0).getUsers().size()).isEqualTo(previousSize + 1);
    }

    @Test
    public void itShouldThrowNotFoundErrorWhenUnsubscribingFromNonExistingSession(){
        long sessionId = 5;
        long userId = 1;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.empty());
        Assertions.assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }

    @Test
    public void  itShouldThrowBadRequestExceptionWhenUserAlreadyDoesNotParticipate(){
        long sessionId = 5;
        long userId = 3;
        given(sessionRepository.findById(sessionId)).willReturn(Optional.ofNullable(sessionList.get(0)));
        Assertions.assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }

    @Test
    public void ItShouldRemoveAUserFromASession(){
        long sessionId = 1;
        long userId = 1;
        int previousSize = sessionList.get(0).getUsers().size();
        given(sessionRepository.findById(sessionId)).willReturn(Optional.ofNullable(sessionList.get(0)));
        sessionService.noLongerParticipate(sessionId, userId);

        assertThat(sessionList.get(0).getUsers().size()).isEqualTo(previousSize -1 );
    }

    @BeforeEach
    public void setup() {
        this.sessionList = new ArrayList<>();
        Teacher t = new Teacher((long)1, "DELAHAYE", "Margot", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00"));
        List<User> users = new ArrayList<>();
        User u1 = new User();
        User u2 = new User();
        u1.setId((long) 1).setAdmin(false).setFirstName("John").setLastName("Doe");
        u2.setId((long) 2).setAdmin(false).setFirstName("Jane").setLastName("Doe");

        users.add(u1);
        users.add(u2);

        sessionList.add(new Session((long)1 , "Session 1", new Date(), "Super Session de sport", t, users, LocalDateTime.parse("2024-04-10T12:00:00"),LocalDateTime.parse("2024-04-10T12:00:00") ));
        sessionList.add(new Session((long)2 , "Session 2", new Date(), "Super Session de sport 2", t, users, LocalDateTime.parse("2024-04-10T12:00:00"),LocalDateTime.parse("2024-04-10T12:00:00") ));

    }

}
