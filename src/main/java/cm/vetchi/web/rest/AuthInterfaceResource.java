package cm.vetchi.web.rest;

import cm.vetchi.domain.AuthInterface;
import cm.vetchi.repository.AuthInterfaceRepository;
import cm.vetchi.service.AuthInterfaceService;
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
 * REST controller for managing {@link cm.vetchi.domain.AuthInterface}.
 */
@RestController
@RequestMapping("/api")
public class AuthInterfaceResource {

    private final Logger log = LoggerFactory.getLogger(AuthInterfaceResource.class);

    private static final String ENTITY_NAME = "authInterface";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AuthInterfaceService authInterfaceService;

    private final AuthInterfaceRepository authInterfaceRepository;

    public AuthInterfaceResource(AuthInterfaceService authInterfaceService, AuthInterfaceRepository authInterfaceRepository) {
        this.authInterfaceService = authInterfaceService;
        this.authInterfaceRepository = authInterfaceRepository;
    }

    /**
     * {@code POST  /auth-interfaces} : Create a new authInterface.
     *
     * @param authInterface the authInterface to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new authInterface, or with status {@code 400 (Bad Request)} if the authInterface has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/auth-interfaces")
    public ResponseEntity<AuthInterface> createAuthInterface(@RequestBody AuthInterface authInterface) throws URISyntaxException {
        log.debug("REST request to save AuthInterface : {}", authInterface);
        if (authInterface.getId() != null) {
            throw new BadRequestAlertException("A new authInterface cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AuthInterface result = authInterfaceService.save(authInterface);
        return ResponseEntity
            .created(new URI("/api/auth-interfaces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /auth-interfaces/:id} : Updates an existing authInterface.
     *
     * @param id the id of the authInterface to save.
     * @param authInterface the authInterface to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authInterface,
     * or with status {@code 400 (Bad Request)} if the authInterface is not valid,
     * or with status {@code 500 (Internal Server Error)} if the authInterface couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/auth-interfaces/{id}")
    public ResponseEntity<AuthInterface> updateAuthInterface(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AuthInterface authInterface
    ) throws URISyntaxException {
        log.debug("REST request to update AuthInterface : {}, {}", id, authInterface);
        if (authInterface.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authInterface.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authInterfaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AuthInterface result = authInterfaceService.update(authInterface);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, authInterface.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /auth-interfaces/:id} : Partial updates given fields of an existing authInterface, field will ignore if it is null
     *
     * @param id the id of the authInterface to save.
     * @param authInterface the authInterface to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated authInterface,
     * or with status {@code 400 (Bad Request)} if the authInterface is not valid,
     * or with status {@code 404 (Not Found)} if the authInterface is not found,
     * or with status {@code 500 (Internal Server Error)} if the authInterface couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/auth-interfaces/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AuthInterface> partialUpdateAuthInterface(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AuthInterface authInterface
    ) throws URISyntaxException {
        log.debug("REST request to partial update AuthInterface partially : {}, {}", id, authInterface);
        if (authInterface.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, authInterface.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!authInterfaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AuthInterface> result = authInterfaceService.partialUpdate(authInterface);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, authInterface.getId().toString())
        );
    }

    /**
     * {@code GET  /auth-interfaces} : get all the authInterfaces.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of authInterfaces in body.
     */
    @GetMapping("/auth-interfaces")
    public ResponseEntity<List<AuthInterface>> getAllAuthInterfaces(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of AuthInterfaces");
        Page<AuthInterface> page = authInterfaceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /auth-interfaces/:id} : get the "id" authInterface.
     *
     * @param id the id of the authInterface to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the authInterface, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/auth-interfaces/{id}")
    public ResponseEntity<AuthInterface> getAuthInterface(@PathVariable Long id) {
        log.debug("REST request to get AuthInterface : {}", id);
        Optional<AuthInterface> authInterface = authInterfaceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(authInterface);
    }

    /**
     * {@code DELETE  /auth-interfaces/:id} : delete the "id" authInterface.
     *
     * @param id the id of the authInterface to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/auth-interfaces/{id}")
    public ResponseEntity<Void> deleteAuthInterface(@PathVariable Long id) {
        log.debug("REST request to delete AuthInterface : {}", id);
        authInterfaceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
