#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/dm-ioctl.h>

#ifndef DM_SUSPEND_FLAG
#define DM_SUSPEND_FLAG (1 << 0)
#endif

int create_dm_dev(const char *name, const char *target_type, const char *target_args) {
    int fd, result;
    size_t buffer_size;
    void *buffer;
    struct dm_ioctl *dm_ctl;
    struct dm_target_spec *tgt;
    char *params;

    fd = open("/dev/mapper/control", O_RDWR);
    if (fd < 0) {
        perror("Failed to open device mapper control");
        return -1;
    }

    // Calculate buffer size
    buffer_size = sizeof(struct dm_ioctl) + sizeof(struct dm_target_spec) + strlen(target_args) + 1;
    buffer = malloc(buffer_size);
    if (!buffer) {
        perror("Failed to allocate buffer");
        close(fd);
        return -1;
    }
    memset(buffer, 0, buffer_size);

    dm_ctl = buffer;
    dm_ctl->version[0] = DM_VERSION_MAJOR;
    dm_ctl->version[1] = DM_VERSION_MINOR;
    dm_ctl->version[2] = DM_VERSION_PATCHLEVEL;
    dm_ctl->data_size = buffer_size;
    dm_ctl->data_start = sizeof(struct dm_ioctl);
    strncpy(dm_ctl->name, name, sizeof(dm_ctl->name));

    // Create the device
    result = ioctl(fd, DM_DEV_CREATE, dm_ctl);
    if (result < 0) {
        perror("Failed to create device mapper device");
        free(buffer);
        close(fd);
        return -1;
    }

    // Set up the target specification
    tgt = (struct dm_target_spec *)((char *)dm_ctl + dm_ctl->data_start);
    params = (char *)tgt + sizeof(struct dm_target_spec);

    tgt->sector_start = 0;
    // 100 MB in sectors (assuming 512 bytes per sector)
  tgt->length = (90 * 1024 * 1024) / 512; // 95 MB in sectors

    strncpy(tgt->target_type, target_type, sizeof(tgt->target_type));
    strcpy(params, target_args);
    tgt->next = 0;

    dm_ctl->target_count = 1;

    // Load the table
    result = ioctl(fd, DM_TABLE_LOAD, dm_ctl);
    if (result < 0) {
        perror("Failed to load device mapper table");
        free(buffer);
        close(fd);
        return -1;
    }

    // Activate the device
    memset(buffer, 0, buffer_size);
    dm_ctl = buffer;
    dm_ctl->version[0] = DM_VERSION_MAJOR;
    dm_ctl->version[1] = DM_VERSION_MINOR;
    dm_ctl->version[2] = DM_VERSION_PATCHLEVEL;
    dm_ctl->data_size = sizeof(struct dm_ioctl);
    dm_ctl->data_start = 0;
    strncpy(dm_ctl->name, name, sizeof(dm_ctl->name));
    dm_ctl->flags = 0; // Clear DM_SUSPEND_FLAG to activate the device

    result = ioctl(fd, DM_DEV_SUSPEND, dm_ctl);
    if (result < 0) {
        perror("Failed to activate device mapper device");
        free(buffer);
        close(fd);
        return -1;
    }

    free(buffer);
    close(fd);
    printf("Device mapper device created successfully: /dev/mapper/%s\n", name);
    return 0;
}

int main() {
    const char *name = "test1";
    const char *target_type = "linear";
    const char *target_args = "/dev/nvme0n1p4 0";

    return create_dm_dev(name, target_type, target_args);
}
