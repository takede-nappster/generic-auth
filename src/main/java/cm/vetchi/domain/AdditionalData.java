package cm.vetchi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A AdditionalData.
 */
@Entity
@Table(name = "additional_data")
public class AdditionalData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "field_code")
    private String fieldCode;

    @Column(name = "value")
    private String value;

    @ManyToMany(mappedBy = "additionalDatas")
    @JsonIgnoreProperties(value = { "roles", "groupes", "additionalDatas", "sessions", "services" }, allowSetters = true)
    private Set<UserInfo> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AdditionalData id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFieldCode() {
        return this.fieldCode;
    }

    public AdditionalData fieldCode(String fieldCode) {
        this.setFieldCode(fieldCode);
        return this;
    }

    public void setFieldCode(String fieldCode) {
        this.fieldCode = fieldCode;
    }

    public String getValue() {
        return this.value;
    }

    public AdditionalData value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Set<UserInfo> getUsers() {
        return this.users;
    }

    public void setUsers(Set<UserInfo> userInfos) {
        if (this.users != null) {
            this.users.forEach(i -> i.removeAdditionalDatas(this));
        }
        if (userInfos != null) {
            userInfos.forEach(i -> i.addAdditionalDatas(this));
        }
        this.users = userInfos;
    }

    public AdditionalData users(Set<UserInfo> userInfos) {
        this.setUsers(userInfos);
        return this;
    }

    public AdditionalData addUsers(UserInfo userInfo) {
        this.users.add(userInfo);
        userInfo.getAdditionalDatas().add(this);
        return this;
    }

    public AdditionalData removeUsers(UserInfo userInfo) {
        this.users.remove(userInfo);
        userInfo.getAdditionalDatas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdditionalData)) {
            return false;
        }
        return id != null && id.equals(((AdditionalData) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdditionalData{" +
            "id=" + getId() +
            ", fieldCode='" + getFieldCode() + "'" +
            ", value='" + getValue() + "'" +
            "}";
    }
}
