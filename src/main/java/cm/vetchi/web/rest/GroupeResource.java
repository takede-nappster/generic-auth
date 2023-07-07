package cm.vetchi.web.rest;

import cm.vetchi.domain.Groupe;
import cm.vetchi.repository.GroupeRepository;
import cm.vetchi.service.GroupeService;
import cm.vetchi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link cm.vetchi.domain.Groupe}.
 */
@RestController
@RequestMapping("/api")
public class GroupeResource {

    private final Logger log = LoggerFactory.getLogger(GroupeResource.class);

    private static final String ENTITY_NAME = "groupe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupeService groupeService;

    private final GroupeRepository groupeRepository;

    public GroupeResource(GroupeService groupeService, GroupeRepository groupeRepository) {
        this.groupeService = groupeService;
        this.groupeRepository = groupeRepository;
    }

    /**
     * {@code POST  /groupes} : Create a new groupe.
     *
     * @param groupe the groupe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new groupe, or with status {@code 400 (Bad Request)} if the groupe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/groupes")
    public ResponseEntity<Groupe> createGroupe(@RequestBody Groupe groupe) throws URISyntaxException {
        log.debug("REST request to save Groupe : {}", groupe);
        if (groupe.getId() != null) {
            throw new BadRequestAlertException("A new groupe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Groupe result = groupeService.save(groupe);
        return ResponseEntity
            .created(new URI("/api/groupes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /groupes/:id} : Updates an existing groupe.
     *
     * @param id the id of the groupe to save.
     * @param groupe the groupe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupe,
     * or with status {@code 400 (Bad Request)} if the groupe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the groupe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/groupes/{id}")
    public ResponseEntity<Groupe> updateGroupe(@PathVariable(value = "id", required = false) final Long id, @RequestBody Groupe groupe)
        throws URISyntaxException {
        log.debug("REST request to update Groupe : {}, {}", id, groupe);
        if (groupe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Groupe result = groupeService.update(groupe);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupe.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /groupes/:id} : Partial updates given fields of an existing groupe, field will ignore if it is null
     *
     * @param id the id of the groupe to save.
     * @param groupe the groupe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupe,
     * or with status {@code 400 (Bad Request)} if the groupe is not valid,
     * or with status {@code 404 (Not Found)} if the groupe is not found,
     * or with status {@code 500 (Internal Server Error)} if the groupe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/groupes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Groupe> partialUpdateGroupe(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Groupe groupe
    ) throws URISyntaxException {
        log.debug("REST request to partial update Groupe partially : {}, {}", id, groupe);
        if (groupe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Groupe> result = groupeService.partialUpdate(groupe);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupe.getId().toString())
        );
    }

    /**
     * {@code GET  /groupes} : get all the groupes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groupes in body.
     */
    @GetMapping("/groupes")
    public ResponseEntity<List<Groupe>> getAllGroupes(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Groupes");
        Page<Groupe> page = groupeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /groupes/:id} : get the "id" groupe.
     *
     * @param id the id of the groupe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the groupe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/groupes/{id}")
    public ResponseEntity<Groupe> getGroupe(@PathVariable Long id) {
        log.debug("REST request to get Groupe : {}", id);
        Optional<Groupe> groupe = groupeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(groupe);
    }

    /**
     * {@code DELETE  /groupes/:id} : delete the "id" groupe.
     *
     * @param id the id of the groupe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/groupes/{id}")
    public ResponseEntity<Void> deleteGroupe(@PathVariable Long id) {
        log.debug("REST request to delete Groupe : {}", id);
        groupeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
