package cm.vetchi.domain;

import cm.vetchi.domain.enumeration.DataType;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A UserData.
 */
@Entity
@Table(name = "user_data")
public class UserData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "field_code")
    private String fieldCode;

    @Column(name = "required_status")
    private Boolean requiredStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private DataType type;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserData id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public UserData fieldName(String fieldName) {
        this.setFieldName(fieldName);
        return this;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldCode() {
        return this.fieldCode;
    }

    public UserData fieldCode(String fieldCode) {
        this.setFieldCode(fieldCode);
        return this;
    }

    public void setFieldCode(String fieldCode) {
        this.fieldCode = fieldCode;
    }

    public Boolean getRequiredStatus() {
        return this.requiredStatus;
    }

    public UserData requiredStatus(Boolean requiredStatus) {
        this.setRequiredStatus(requiredStatus);
        return this;
    }

    public void setRequiredStatus(Boolean requiredStatus) {
        this.requiredStatus = requiredStatus;
    }

    public DataType getType() {
        return this.type;
    }

    public UserData type(DataType type) {
        this.setType(type);
        return this;
    }

    public void setType(DataType type) {
        this.type = type;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserData)) {
            return false;
        }
        return id != null && id.equals(((UserData) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserData{" +
            "id=" + getId() +
            ", fieldName='" + getFieldName() + "'" +
            ", fieldCode='" + getFieldCode() + "'" +
            ", requiredStatus='" + getRequiredStatus() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
