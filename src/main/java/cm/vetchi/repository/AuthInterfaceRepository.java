package cm.vetchi.repository;

import cm.vetchi.domain.AuthInterface;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AuthInterface entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthInterfaceRepository extends JpaRepository<AuthInterface, Long> {}
