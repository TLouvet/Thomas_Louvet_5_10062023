package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private List<Teacher> teacherList;

    @Test
    public void itShouldGetAllTeachers(){
        given(teacherRepository.findAll()).willReturn(teacherList);
        List<Teacher> teachers = teacherService.findAll();

        assertThat(teachers)
                .isNotNull()
                .isEqualTo(teacherList);
    }

    @Test
    public void itShouldGetOneTeacherIfExistent(){
        Teacher expectedTeacher = teacherList.get(0);
        given(teacherRepository.findById((long)1)).willReturn(Optional.ofNullable(expectedTeacher));

        Teacher receivedTeacher = teacherService.findById((long) 1);
        assertThat(receivedTeacher)
                .isNotNull()
                .isEqualTo(expectedTeacher);
    }

    @Test
    public void itShouldNotGetNonExistingTeacher(){
        long testedIndex = 3;
        Optional<Teacher> expectedTeacher = Optional.empty();
        given(teacherRepository.findById(testedIndex)).willReturn((expectedTeacher));

        Teacher receivedTeacher = teacherService.findById(testedIndex);
        assertThat(receivedTeacher).isNull();
    }

    @BeforeEach
    public void setup() {
        this.teacherList = new ArrayList<>();
        teacherList.add(new Teacher((long)1, "DELAHAYE", "Margot", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00")));
        teacherList.add(new Teacher((long)2, "THIERCELIN", "Hélène", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00")));
    }
}
