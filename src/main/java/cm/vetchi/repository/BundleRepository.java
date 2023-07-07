package cm.vetchi.repository;

import cm.vetchi.domain.Bundle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bundle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BundleRepository extends JpaRepository<Bundle, Long> {}
