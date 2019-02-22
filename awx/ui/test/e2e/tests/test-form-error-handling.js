import {
    getJobTemplate
} from '../fixtures';

const namespace = 'test-form-error-handling';

let data;
const spinny = "//*[contains(@class, 'spinny')]";

const templatesNavTab = "//at-side-nav-item[contains(@name, 'TEMPLATES')]";

module.exports = {
    before: (client, done) => {
        const resources = [
            getJobTemplate(namespace)
        ];

        Promise.all(resources)
            .then(([jt]) => {
                data = { jt };
                done();
            });
        client
            .login()
            .waitForAngular()
            .resizeWindow(1200, 1000)
            .useXpath()
            .findThenClick(templatesNavTab)
            .findThenClick('//*[@id="button-add"]')
            .findThenClick('//a[@ui-sref="templates.addJobTemplate"]');
    },
    'Test max character limit when creating a job template': client => {
        client
            .waitForElementVisible('//input[@id="job_template_name"]')
            .setValue('//input[@id="job_template_name"]',
                ['a'.repeat(513), client.Keys.ENTER])
            .setValue('//input[@name="inventory_name"]',
               [namespace + '-inventory', client.Keys.ENTER])
            .setValue('//input[@name="project_name"]',
                [namespace + '-project', client.Keys.ENTER])

            // clicked twice to make the element an active field
            .findThenClick('//*[@id="select2-playbook-select-container"]')
            .findThenClick('//*[@id="select2-playbook-select-container"]')
            .findThenClick('//li[text()="hello_world.yml"]')
            .findThenClick('//*[@id="job_template_save_btn"]')
            .findThenClick('//*[@id="alert_ok_btn"]');

        client.expect.element('//div[@id="job_template_name_group"]' +
            '//div[@id="job_template-name-api-error"]').to.be.visible.before(3000);
    },

    'Test incorrect format when creating a job template': client => {},

    'Test max character limit when editing a job template': client => {},

    'Test incorrect format when editing a job template': client => {},

    'Test duplicate template name handling when creating a job template': client => {},

    'Test duplicate template name handling when editing a job template': client => {},

    'Test max character limit when creating an organization': client => {},

    'Test incorrect format when creating an organization': client => {},

    'Test max character limit when editing an organization': client => {},

    'Test incorrect format when editing an organization': client => {},

    'Test duplicate template name handling when creating an organization': client => {},

    'Test duplicate template name handling when editing an organization': client => {},

    after: client => {
        client.end();
    }
};
