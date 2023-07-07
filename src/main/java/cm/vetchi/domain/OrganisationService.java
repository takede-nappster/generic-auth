package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A OrganisationService.
 */
@Entity
@Table(name = "organisation_service")
public class OrganisationService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
        name = "rel_organisation_service__members",
        joinColumns = @JoinColumn(name = "organisation_service_id"),
        inverseJoinColumns = @JoinColumn(name = "members_id")
    )
    @JsonIgnoreProperties(value = { "roles", "groupes", "additionalDatas", "sessions", "services" }, allowSetters = true)
    private Set<UserInfo> members = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_organisation_service__groups",
        joinColumns = @JoinColumn(name = "organisation_service_id"),
        inverseJoinColumns = @JoinColumn(name = "groups_id")
    )
    @JsonIgnoreProperties(value = { "members", "services" }, allowSetters = true)
    private Set<Groupe> groups = new HashSet<>();

    @ManyToMany(mappedBy = "services")
    @JsonIgnoreProperties(value = { "subscriptions", "userdatas", "services", "interfaces" }, allowSetters = true)
    private Set<Organisation> organisations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrganisationService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public OrganisationService name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public OrganisationService description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<UserInfo> getMembers() {
        return this.members;
    }

    public void setMembers(Set<UserInfo> userInfos) {
        this.members = userInfos;
    }

    public OrganisationService members(Set<UserInfo> userInfos) {
        this.setMembers(userInfos);
        return this;
    }

    public OrganisationService addMembers(UserInfo userInfo) {
        this.members.add(userInfo);
        userInfo.getServices().add(this);
        return this;
    }

    public OrganisationService removeMembers(UserInfo userInfo) {
        this.members.remove(userInfo);
        userInfo.getServices().remove(this);
        return this;
    }

    public Set<Groupe> getGroups() {
        return this.groups;
    }

    public void setGroups(Set<Groupe> groupes) {
        this.groups = groupes;
    }

    public OrganisationService groups(Set<Groupe> groupes) {
        this.setGroups(groupes);
        return this;
    }

    public OrganisationService addGroups(Groupe groupe) {
        this.groups.add(groupe);
        groupe.getServices().add(this);
        return this;
    }

    public OrganisationService removeGroups(Groupe groupe) {
        this.groups.remove(groupe);
        groupe.getServices().remove(this);
        return this;
    }

    public Set<Organisation> getOrganisations() {
        return this.organisations;
    }

    public void setOrganisations(Set<Organisation> organisations) {
        if (this.organisations != null) {
            this.organisations.forEach(i -> i.removeServices(this));
        }
        if (organisations != null) {
            organisations.forEach(i -> i.addServices(this));
        }
        this.organisations = organisations;
    }

    public OrganisationService organisations(Set<Organisation> organisations) {
        this.setOrganisations(organisations);
        return this;
    }

    public OrganisationService addOrganisation(Organisation organisation) {
        this.organisations.add(organisation);
        organisation.getServices().add(this);
        return this;
    }

    public OrganisationService removeOrganisation(Organisation organisation) {
        this.organisations.remove(organisation);
        organisation.getServices().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganisationService)) {
            return false;
        }
        return id != null && id.equals(((OrganisationService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganisationService{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
