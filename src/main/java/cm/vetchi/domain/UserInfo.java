package cm.vetchi.domain;

import cm.vetchi.domain.enumeration.UserType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A UserInfo.
 */
@Entity
@Table(name = "user_info")
public class UserInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "username")
    private String username;

    @Column(name = "imagebiometric")
    private String imagebiometric;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "authrizations", "users" }, allowSetters = true)
    private Role roles;

    @ManyToOne
    @JsonIgnoreProperties(value = { "members", "services" }, allowSetters = true)
    private Groupe groupes;

    @ManyToMany
    @JoinTable(
        name = "rel_user_info__additional_datas",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "additional_datas_id")
    )
    @JsonIgnoreProperties(value = { "users" }, allowSetters = true)
    private Set<AdditionalData> additionalDatas = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_user_info__sessions",
        joinColumns = @JoinColumn(name = "user_info_id"),
        inverseJoinColumns = @JoinColumn(name = "sessions_id")
    )
    @JsonIgnoreProperties(value = { "sessions" }, allowSetters = true)
    private Set<Session> sessions = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    @JsonIgnoreProperties(value = { "members", "groups", "organisations" }, allowSetters = true)
    private Set<OrganisationService> services = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserInfo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public UserInfo firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public UserInfo lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return this.username;
    }

    public UserInfo username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImagebiometric() {
        return this.imagebiometric;
    }

    public UserInfo imagebiometric(String imagebiometric) {
        this.setImagebiometric(imagebiometric);
        return this;
    }

    public void setImagebiometric(String imagebiometric) {
        this.imagebiometric = imagebiometric;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public UserInfo dateOfBirth(LocalDate dateOfBirth) {
        this.setDateOfBirth(dateOfBirth);
        return this;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public UserType getUserType() {
        return this.userType;
    }

    public UserInfo userType(UserType userType) {
        this.setUserType(userType);
        return this;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public Role getRoles() {
        return this.roles;
    }

    public void setRoles(Role role) {
        this.roles = role;
    }

    public UserInfo roles(Role role) {
        this.setRoles(role);
        return this;
    }

    public Groupe getGroupes() {
        return this.groupes;
    }

    public void setGroupes(Groupe groupe) {
        this.groupes = groupe;
    }

    public UserInfo groupes(Groupe groupe) {
        this.setGroupes(groupe);
        return this;
    }

    public Set<AdditionalData> getAdditionalDatas() {
        return this.additionalDatas;
    }

    public void setAdditionalDatas(Set<AdditionalData> additionalData) {
        this.additionalDatas = additionalData;
    }

    public UserInfo additionalDatas(Set<AdditionalData> additionalData) {
        this.setAdditionalDatas(additionalData);
        return this;
    }

    public UserInfo addAdditionalDatas(AdditionalData additionalData) {
        this.additionalDatas.add(additionalData);
        additionalData.getUsers().add(this);
        return this;
    }

    public UserInfo removeAdditionalDatas(AdditionalData additionalData) {
        this.additionalDatas.remove(additionalData);
        additionalData.getUsers().remove(this);
        return this;
    }

    public Set<Session> getSessions() {
        return this.sessions;
    }

    public void setSessions(Set<Session> sessions) {
        this.sessions = sessions;
    }

    public UserInfo sessions(Set<Session> sessions) {
        this.setSessions(sessions);
        return this;
    }

    public UserInfo addSessions(Session session) {
        this.sessions.add(session);
        session.getSessions().add(this);
        return this;
    }

    public UserInfo removeSessions(Session session) {
        this.sessions.remove(session);
        session.getSessions().remove(this);
        return this;
    }

    public Set<OrganisationService> getServices() {
        return this.services;
    }

    public void setServices(Set<OrganisationService> organisationServices) {
        if (this.services != null) {
            this.services.forEach(i -> i.removeMembers(this));
        }
        if (organisationServices != null) {
            organisationServices.forEach(i -> i.addMembers(this));
        }
        this.services = organisationServices;
    }

    public UserInfo services(Set<OrganisationService> organisationServices) {
        this.setServices(organisationServices);
        return this;
    }

    public UserInfo addService(OrganisationService organisationService) {
        this.services.add(organisationService);
        organisationService.getMembers().add(this);
        return this;
    }

    public UserInfo removeService(OrganisationService organisationService) {
        this.services.remove(organisationService);
        organisationService.getMembers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserInfo)) {
            return false;
        }
        return id != null && id.equals(((UserInfo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserInfo{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", username='" + getUsername() + "'" +
            ", imagebiometric='" + getImagebiometric() + "'" +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            ", userType='" + getUserType() + "'" +
            "}";
    }
}
