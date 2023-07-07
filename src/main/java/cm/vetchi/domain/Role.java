package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Role.
 */
@Entity
@Table(name = "role")
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "roles" }, allowSetters = true)
    private Authorization authrizations;

    @OneToMany(mappedBy = "roles")
    @JsonIgnoreProperties(value = { "roles", "groupes", "additionalDatas", "sessions", "services" }, allowSetters = true)
    private Set<UserInfo> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Role id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Role name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Role description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Authorization getAuthrizations() {
        return this.authrizations;
    }

    public void setAuthrizations(Authorization authorization) {
        this.authrizations = authorization;
    }

    public Role authrizations(Authorization authorization) {
        this.setAuthrizations(authorization);
        return this;
    }

    public Set<UserInfo> getUsers() {
        return this.users;
    }

    public void setUsers(Set<UserInfo> userInfos) {
        if (this.users != null) {
            this.users.forEach(i -> i.setRoles(null));
        }
        if (userInfos != null) {
            userInfos.forEach(i -> i.setRoles(this));
        }
        this.users = userInfos;
    }

    public Role users(Set<UserInfo> userInfos) {
        this.setUsers(userInfos);
        return this;
    }

    public Role addUsers(UserInfo userInfo) {
        this.users.add(userInfo);
        userInfo.setRoles(this);
        return this;
    }

    public Role removeUsers(UserInfo userInfo) {
        this.users.remove(userInfo);
        userInfo.setRoles(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Role)) {
            return false;
        }
        return id != null && id.equals(((Role) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Role{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
