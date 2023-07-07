package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A AuthInterface.
 */
@Entity
@Table(name = "auth_interface")
public class AuthInterface implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "url")
    private String url;

    @Column(name = "driver_name")
    private String driverName;

    @ManyToOne
    private InterfaceParam prams;

    @ManyToMany(mappedBy = "interfaces")
    @JsonIgnoreProperties(value = { "subscriptions", "userdatas", "services", "interfaces" }, allowSetters = true)
    private Set<Organisation> organisations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AuthInterface id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public AuthInterface name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public AuthInterface description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return this.url;
    }

    public AuthInterface url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDriverName() {
        return this.driverName;
    }

    public AuthInterface driverName(String driverName) {
        this.setDriverName(driverName);
        return this;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public InterfaceParam getPrams() {
        return this.prams;
    }

    public void setPrams(InterfaceParam interfaceParam) {
        this.prams = interfaceParam;
    }

    public AuthInterface prams(InterfaceParam interfaceParam) {
        this.setPrams(interfaceParam);
        return this;
    }

    public Set<Organisation> getOrganisations() {
        return this.organisations;
    }

    public void setOrganisations(Set<Organisation> organisations) {
        if (this.organisations != null) {
            this.organisations.forEach(i -> i.removeInterfaces(this));
        }
        if (organisations != null) {
            organisations.forEach(i -> i.addInterfaces(this));
        }
        this.organisations = organisations;
    }

    public AuthInterface organisations(Set<Organisation> organisations) {
        this.setOrganisations(organisations);
        return this;
    }

    public AuthInterface addOrganisation(Organisation organisation) {
        this.organisations.add(organisation);
        organisation.getInterfaces().add(this);
        return this;
    }

    public AuthInterface removeOrganisation(Organisation organisation) {
        this.organisations.remove(organisation);
        organisation.getInterfaces().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuthInterface)) {
            return false;
        }
        return id != null && id.equals(((AuthInterface) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AuthInterface{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", url='" + getUrl() + "'" +
            ", driverName='" + getDriverName() + "'" +
            "}";
    }
}
