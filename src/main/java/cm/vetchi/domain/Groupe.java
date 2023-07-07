package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Groupe.
 */
@Entity
@Table(name = "groupe")
public class Groupe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "descrtion")
    private String descrtion;

    @OneToMany(mappedBy = "groupes")
    @JsonIgnoreProperties(value = { "roles", "groupes", "additionalDatas", "sessions", "services" }, allowSetters = true)
    private Set<UserInfo> members = new HashSet<>();

    @ManyToMany(mappedBy = "groups")
    @JsonIgnoreProperties(value = { "members", "groups", "organisations" }, allowSetters = true)
    private Set<OrganisationService> services = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Groupe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Groupe name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescrtion() {
        return this.descrtion;
    }

    public Groupe descrtion(String descrtion) {
        this.setDescrtion(descrtion);
        return this;
    }

    public void setDescrtion(String descrtion) {
        this.descrtion = descrtion;
    }

    public Set<UserInfo> getMembers() {
        return this.members;
    }

    public void setMembers(Set<UserInfo> userInfos) {
        if (this.members != null) {
            this.members.forEach(i -> i.setGroupes(null));
        }
        if (userInfos != null) {
            userInfos.forEach(i -> i.setGroupes(this));
        }
        this.members = userInfos;
    }

    public Groupe members(Set<UserInfo> userInfos) {
        this.setMembers(userInfos);
        return this;
    }

    public Groupe addMembers(UserInfo userInfo) {
        this.members.add(userInfo);
        userInfo.setGroupes(this);
        return this;
    }

    public Groupe removeMembers(UserInfo userInfo) {
        this.members.remove(userInfo);
        userInfo.setGroupes(null);
        return this;
    }

    public Set<OrganisationService> getServices() {
        return this.services;
    }

    public void setServices(Set<OrganisationService> organisationServices) {
        if (this.services != null) {
            this.services.forEach(i -> i.removeGroups(this));
        }
        if (organisationServices != null) {
            organisationServices.forEach(i -> i.addGroups(this));
        }
        this.services = organisationServices;
    }

    public Groupe services(Set<OrganisationService> organisationServices) {
        this.setServices(organisationServices);
        return this;
    }

    public Groupe addService(OrganisationService organisationService) {
        this.services.add(organisationService);
        organisationService.getGroups().add(this);
        return this;
    }

    public Groupe removeService(OrganisationService organisationService) {
        this.services.remove(organisationService);
        organisationService.getGroups().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Groupe)) {
            return false;
        }
        return id != null && id.equals(((Groupe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Groupe{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", descrtion='" + getDescrtion() + "'" +
            "}";
    }
}
