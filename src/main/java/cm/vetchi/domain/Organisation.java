package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Organisation.
 */
@Entity
@Table(name = "organisation")
public class Organisation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "token")
    private String token;

    @ManyToOne
    private Bundle subscriptions;

    @ManyToOne
    private UserData userdatas;

    @ManyToMany
    @JoinTable(
        name = "rel_organisation__services",
        joinColumns = @JoinColumn(name = "organisation_id"),
        inverseJoinColumns = @JoinColumn(name = "services_id")
    )
    @JsonIgnoreProperties(value = { "members", "groups", "organisations" }, allowSetters = true)
    private Set<OrganisationService> services = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_organisation__interfaces",
        joinColumns = @JoinColumn(name = "organisation_id"),
        inverseJoinColumns = @JoinColumn(name = "interfaces_id")
    )
    @JsonIgnoreProperties(value = { "prams", "organisations" }, allowSetters = true)
    private Set<AuthInterface> interfaces = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Organisation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Organisation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Organisation description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return this.email;
    }

    public Organisation email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public Organisation password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return this.token;
    }

    public Organisation token(String token) {
        this.setToken(token);
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Bundle getSubscriptions() {
        return this.subscriptions;
    }

    public void setSubscriptions(Bundle bundle) {
        this.subscriptions = bundle;
    }

    public Organisation subscriptions(Bundle bundle) {
        this.setSubscriptions(bundle);
        return this;
    }

    public UserData getUserdatas() {
        return this.userdatas;
    }

    public void setUserdatas(UserData userData) {
        this.userdatas = userData;
    }

    public Organisation userdatas(UserData userData) {
        this.setUserdatas(userData);
        return this;
    }

    public Set<OrganisationService> getServices() {
        return this.services;
    }

    public void setServices(Set<OrganisationService> organisationServices) {
        this.services = organisationServices;
    }

    public Organisation services(Set<OrganisationService> organisationServices) {
        this.setServices(organisationServices);
        return this;
    }

    public Organisation addServices(OrganisationService organisationService) {
        this.services.add(organisationService);
        organisationService.getOrganisations().add(this);
        return this;
    }

    public Organisation removeServices(OrganisationService organisationService) {
        this.services.remove(organisationService);
        organisationService.getOrganisations().remove(this);
        return this;
    }

    public Set<AuthInterface> getInterfaces() {
        return this.interfaces;
    }

    public void setInterfaces(Set<AuthInterface> authInterfaces) {
        this.interfaces = authInterfaces;
    }

    public Organisation interfaces(Set<AuthInterface> authInterfaces) {
        this.setInterfaces(authInterfaces);
        return this;
    }

    public Organisation addInterfaces(AuthInterface authInterface) {
        this.interfaces.add(authInterface);
        authInterface.getOrganisations().add(this);
        return this;
    }

    public Organisation removeInterfaces(AuthInterface authInterface) {
        this.interfaces.remove(authInterface);
        authInterface.getOrganisations().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Organisation)) {
            return false;
        }
        return id != null && id.equals(((Organisation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Organisation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", email='" + getEmail() + "'" +
            ", password='" + getPassword() + "'" +
            ", token='" + getToken() + "'" +
            "}";
    }
}
