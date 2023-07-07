package cm.vetchi.repository;

import cm.vetchi.domain.UserInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface UserInfoRepositoryWithBagRelationships {
    Optional<UserInfo> fetchBagRelationships(Optional<UserInfo> userInfo);

    List<UserInfo> fetchBagRelationships(List<UserInfo> userInfos);

    Page<UserInfo> fetchBagRelationships(Page<UserInfo> userInfos);
}
