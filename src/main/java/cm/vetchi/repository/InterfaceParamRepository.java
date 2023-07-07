package cm.vetchi.repository;

import cm.vetchi.domain.InterfaceParam;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the InterfaceParam entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InterfaceParamRepository extends JpaRepository<InterfaceParam, Long> {}
