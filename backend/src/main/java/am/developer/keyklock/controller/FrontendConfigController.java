package am.developer.keyklock.controller;

import am.developer.keyklock.service.ProfileDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class FrontendConfigController {

    final ProfileDataService profileDataService;

    public FrontendConfigController(ProfileDataService profileDataService) {
        this.profileDataService = profileDataService;
    }

    @GetMapping("/frontend/info")
    public ResponseEntity<?> findAll() {
        Map map = new HashMap();
        map.put("ADMIN", "somepermision");

        return ResponseEntity.status(HttpStatus.OK).body(
              profileDataService.getKeycloakUserPrinciple().getUserRole()
        );
    }

    @GetMapping("/roles")
    public ResponseEntity<?> getRoles() {
        Map map = new HashMap();
        map.put("ADMIN", "somepermision");
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

}
