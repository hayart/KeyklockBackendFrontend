package am.developer.keyklock.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserData implements Serializable {
    private String username;
    private String userEmail;
    private String userRole;
}
