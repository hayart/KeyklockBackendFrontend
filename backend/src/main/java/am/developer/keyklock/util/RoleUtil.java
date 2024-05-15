package am.developer.keyklock.util;

import org.keycloak.representations.AccessToken;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Utility class to manage user's roles
 */
public final class RoleUtil {

    /**
     * Active role attribute name
     */
    public static final String ACTIVE_ROLE = "active_role";

    /**
     * Active session state attribute name
     */
    public static final String ACTIVE_SESSION_STATE = "active_session_state";

    /**
     * private empty constructor
     */
    private RoleUtil() {
    }

    /**
     * Filters user's roles, then fetches active role.
     *
     * @param accessToken    AccessToken
     * @param clientResource client resource name
     * @param noDisplayRoles list of roles that no need to display
     * @param adminRole      admin role name
     * @return active role name if exists
     */
    public static Optional<String> findActiveRole(final AccessToken accessToken,
                                                  final String clientResource,
                                                  final List<String> noDisplayRoles,
                                                  final String adminRole) {
        List<String> filteredRoles = getFilteredRoles(accessToken, clientResource, noDisplayRoles);
        return findActiveRole(accessToken, filteredRoles, adminRole);
    }

    /**
     * Finds active role.
     * If user has ADMIN_ROLE (OPS variable) and exists in the roles available, then active role is ADMIN_ROLE.
     * If user has ACTIVE_ROLE in the token and exists in the roles available then active role is ACTIVE_ROLE.
     * Otherwise, active role is first one in the available roles
     *
     * @param accessToken AccessToken
     * @param roles       list of role from where need to find active role
     * @param adminRole   admin role name
     * @return active role name if exists
     */
    public static Optional<String> findActiveRole(final AccessToken accessToken, final List<String> roles, final String adminRole) {
        if (roles.isEmpty()) {
            return Optional.empty();
        }

        // When user has stored role from current session
        boolean checkKcRoleAttribute = true;
        final String currentSessionState = accessToken.getSessionState();
        Object kcActiveSessionStateObj = accessToken.getOtherClaims().get(ACTIVE_SESSION_STATE);
        if (kcActiveSessionStateObj != null) {
            String kcActiveSessionState = (String) kcActiveSessionStateObj;
            if (!kcActiveSessionState.equals("") && currentSessionState.equals(kcActiveSessionState)) {
                Optional<String> activeRole = getKcAttributeActiveRole(accessToken, roles);
                if (activeRole.isPresent()) {
                    return activeRole;
                } else {
                    checkKcRoleAttribute = false;
                }
            }
        }

        // When user has predefined admin role and in current session role was not changed
        if (!adminRole.equals("") && roles.contains(adminRole)) {
            return Optional.of(adminRole);
        }

        // When user has stored role from current session or from previous session, but in this case user must not have predefined admin role
        if (checkKcRoleAttribute) {
            Optional<String> activeRole = getKcAttributeActiveRole(accessToken, roles);
            if (activeRole.isPresent()) {
                return activeRole;
            }
        }

        return Optional.of(roles.get(0));
    }

    /**
     * Filters user's roles and eliminates no display roles
     *
     * @param accessToken    AccessToken
     * @param clientResource client resource name
     * @param noDisplayRoles list of roles that no need to display
     * @return list of filtered roles
     */
    public static List<String> getFilteredRoles(final AccessToken accessToken, final String clientResource, final List<String> noDisplayRoles) {
        Set<String> allRoles = new HashSet<>();
        allRoles.addAll(getRealmRoles(accessToken));
        allRoles.addAll(getClientRoles(accessToken, clientResource));

        Predicate<String> displayRole = role -> noDisplayRoles.stream()
                .noneMatch(noDisplayRole ->
                        (noDisplayRole.endsWith("*") && role.startsWith(noDisplayRole.substring(0, noDisplayRole.length() - 1))) ||
                                noDisplayRole.equals(role)
                );

        return allRoles.stream()
                .filter(displayRole)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves realm roles using AccessToken's realm access
     *
     * @param accessToken AccessToken
     * @return set of realm roles
     */
    private static Set<String> getRealmRoles(final AccessToken accessToken) {
        AccessToken.Access access = accessToken.getRealmAccess();
        return getRoles(access);
    }

    /**
     * Retrieves client (defined in KEYCLOAK_RESOURCE) roles using AccessToken's resource access
     *
     * @param accessToken    AccessToken
     * @param clientResource client resource name
     * @return set of client roles
     */
    private static Set<String> getClientRoles(final AccessToken accessToken, final String clientResource) {
        AccessToken.Access access = accessToken.getResourceAccess(clientResource);
        return getRoles(access);
    }

    /**
     * Retrieves roles using AccessToken.Access
     *
     * @param access AccessToken.Access
     * @return set of roles
     */
    private static Set<String> getRoles(AccessToken.Access access) {
        if (access != null) {
            return access.getRoles();
        }
        return new HashSet<>();
    }

    /**
     * If user has ACTIVE_ROLE in the token and exists in the roles available then fetch that role.
     *
     * @param accessToken AccessToken
     * @param roles       list of role from where need to find active role
     * @return ACTIVE_ROLE name if exists and available in the roles
     */
    private static Optional<String> getKcAttributeActiveRole(final AccessToken accessToken, final List<String> roles) {
        Object kcActiveRoleObj = accessToken.getOtherClaims().get(ACTIVE_ROLE);
        if (kcActiveRoleObj != null) {
            String kcActiveRole = (String) kcActiveRoleObj;
            if (!kcActiveRole.equals("") && roles.contains(kcActiveRole)) {
                return Optional.of(kcActiveRole);
            }
        }
        return Optional.empty();
    }

}
